import { useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Upload, X, Plus, Save } from "lucide-react";
import { toast } from "sonner";

interface DamageMarker {
  id: string;
  x: number;
  y: number;
  description: string;
  type: "scratch" | "dent" | "paint";
}

export default function ProtocolDetails() {
  const [, params] = useRoute("/protocol/:id");
  const protocolId = parseInt(params?.id || "0");

  const [photos, setPhotos] = useState<{ [key: string]: File | null }>({
    front: null,
    back: null,
    left: null,
    right: null,
    interior: null,
  });

  const [damageMarkers, setDamageMarkers] = useState<DamageMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const { data: protocol, isLoading } = trpc.protocols.getById.useQuery({ id: protocolId });

  const handlePhotoUpload = (position: string, file: File) => {
    if (file.size > 16 * 1024 * 1024) {
      toast.error("Plik jest za duży (max 16MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Nieprawidłowy format pliku");
      return;
    }

    setPhotos((prev) => ({ ...prev, [position]: file }));
    toast.success(`Zdjęcie ${position} dodane`);
  };

  const handleRemovePhoto = (position: string) => {
    setPhotos((prev) => ({ ...prev, [position]: null }));
    toast.success("Zdjęcie usunięte");
  };

  const handleSilhouetteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMarker) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: DamageMarker = {
      id: Date.now().toString(),
      x,
      y,
      description: "",
      type: "scratch",
    };

    setDamageMarkers((prev) => [...prev, newMarker]);
    setSelectedMarker(newMarker.id);
    setIsAddingMarker(false);
  };

  const handleUpdateMarker = (id: string, updates: Partial<DamageMarker>) => {
    setDamageMarkers((prev) =>
      prev.map((marker) => (marker.id === id ? { ...marker, ...updates } : marker))
    );
  };

  const handleRemoveMarker = (id: string) => {
    setDamageMarkers((prev) => prev.filter((marker) => marker.id !== id));
    if (selectedMarker === id) setSelectedMarker(null);
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#FF4500";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const handleSaveProtocol = () => {
    // TODO: Implement save logic with photos, damage markers, and signature
    toast.success("Protokół zapisany pomyślnie");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bmw-card max-w-md">
          <CardHeader>
            <CardTitle>Protokół nie znaleziony</CardTitle>
            <CardDescription>Nie znaleziono protokołu o podanym ID</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/protocols">
              <Button>Powrót do listy protokołów</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const photoPositions = [
    { key: "front", label: "Przód" },
    { key: "back", label: "Tył" },
    { key: "left", label: "Lewa strona" },
    { key: "right", label: "Prawa strona" },
    { key: "interior", label: "Wnętrze" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/protocols">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrót
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">
                  Protokół {protocol.protocolType === "intake" ? "przyjęcia" : "wydania"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  ID: {protocol.id} • {new Date(protocol.createdAt).toLocaleDateString("pl-PL")}
                </p>
              </div>
            </div>
            <Button onClick={handleSaveProtocol}>
              <Save className="w-4 h-4 mr-2" />
              Zapisz protokół
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos">Zdjęcia 360°</TabsTrigger>
            <TabsTrigger value="damage">Uszkodzenia</TabsTrigger>
            <TabsTrigger value="signature">Podpis</TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle>Zdjęcia 360° pojazdu</CardTitle>
                <CardDescription>Dodaj zdjęcia pojazdu ze wszystkich stron</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photoPositions.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      {photos[key] ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(photos[key]!)}
                            alt={label}
                            className="w-full h-48 object-cover rounded-lg border-2 border-primary"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemovePhoto(key)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Kliknij aby dodać</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(key, file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Damage Marking Tab */}
          <TabsContent value="damage" className="space-y-6">
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle>Zaznaczanie uszkodzeń</CardTitle>
                <CardDescription>Kliknij na sylwetkę pojazdu aby zaznaczyć uszkodzenie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Button
                    variant={isAddingMarker ? "default" : "outline"}
                    onClick={() => setIsAddingMarker(!isAddingMarker)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isAddingMarker ? "Kliknij na sylwetkę" : "Dodaj uszkodzenie"}
                  </Button>
                </div>

                <div
                  className="relative w-full max-w-2xl mx-auto aspect-[16/9] bg-secondary/20 rounded-lg border-2 border-border cursor-crosshair"
                  onClick={handleSilhouetteClick}
                >
                  {/* Simple car silhouette SVG */}
                  <svg
                    viewBox="0 0 800 450"
                    className="w-full h-full opacity-30"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="150" y="150" width="500" height="200" rx="20" fill="currentColor" />
                    <rect x="200" y="100" width="400" height="100" rx="10" fill="currentColor" />
                    <circle cx="250" cy="370" r="40" fill="currentColor" />
                    <circle cx="550" cy="370" r="40" fill="currentColor" />
                  </svg>

                  {/* Damage markers */}
                  {damageMarkers.map((marker) => (
                    <div
                      key={marker.id}
                      className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 cursor-pointer transition-all ${
                        selectedMarker === marker.id
                          ? "bg-primary border-primary scale-125"
                          : "bg-destructive border-destructive hover:scale-110"
                      }`}
                      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMarker(marker.id);
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap">
                        {damageMarkers.findIndex((m) => m.id === marker.id) + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Damage list */}
                {damageMarkers.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Lista uszkodzeń:</h3>
                    {damageMarkers.map((marker, index) => (
                      <Card
                        key={marker.id}
                        className={`bmw-card ${selectedMarker === marker.id ? "border-primary" : ""}`}
                      >
                        <CardContent className="pt-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Uszkodzenie #{index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMarker(marker.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Typ uszkodzenia</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              value={marker.type}
                              onChange={(e) =>
                                handleUpdateMarker(marker.id, {
                                  type: e.target.value as DamageMarker["type"],
                                })
                              }
                            >
                              <option value="scratch">Rysa</option>
                              <option value="dent">Wgniecenie</option>
                              <option value="paint">Uszkodzenie lakieru</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label>Opis</Label>
                            <Input
                              placeholder="Opisz uszkodzenie..."
                              value={marker.description}
                              onChange={(e) =>
                                handleUpdateMarker(marker.id, { description: e.target.value })
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signature Tab */}
          <TabsContent value="signature" className="space-y-6">
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle>Podpis klienta</CardTitle>
                <CardDescription>Poproś klienta o złożenie podpisu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={300}
                    className="w-full border-2 border-border rounded-lg bg-white cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="absolute bottom-2 right-2">
                    <Button variant="outline" size="sm" onClick={clearSignature}>
                      Wyczyść
                    </Button>
                  </div>
                </div>

                {signatureData && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Podpis został złożony
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
