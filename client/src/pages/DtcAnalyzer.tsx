import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Search, AlertTriangle, CheckCircle2, Wrench, DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DtcAnalyzer() {
  const [dtcCode, setDtcCode] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    clientId: 1, // Default to first client for now
    vin: "",
    brand: "BMW",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    engine: "",
    transmission: "",
    licensePlate: "",
  });

  const { data: vehicles = [], refetch: refetchVehicles } = trpc.vehicles.list.useQuery();
  const createVehicleMutation = trpc.vehicles.create.useMutation({
    onSuccess: () => {
      toast.success("Pojazd został dodany");
      setIsAddVehicleDialogOpen(false);
      setNewVehicle({
        clientId: 1,
        vin: "",
        brand: "BMW",
        model: "",
        year: new Date().getFullYear(),
        mileage: 0,
        engine: "",
        transmission: "",
        licensePlate: "",
      });
      refetchVehicles();
    },
    onError: (error: any) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const handleAddVehicle = () => {
    if (!newVehicle.vin || !newVehicle.model) {
      toast.error("VIN i model są wymagane");
      return;
    }
    createVehicleMutation.mutate(newVehicle);
  };
  const analyzeMutation = trpc.dtc.analyze.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success("Analiza kodu DTC zakończona");
    },
    onError: (error) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const handleAnalyze = () => {
    if (!dtcCode.trim()) {
      toast.error("Wprowadź kod DTC");
      return;
    }
    if (!selectedVehicleId) {
      toast.error("Wybierz pojazd");
      return;
    }

    analyzeMutation.mutate({
      code: dtcCode.toUpperCase(),
      vehicleId: selectedVehicleId,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Search className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">DTC Analyzer Pro</h1>
                <p className="text-sm text-muted-foreground">Diagnostyka kodów błędów OBD2</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Input Section */}
        <Card className="bmw-card mb-8">
          <CardHeader>
            <CardTitle>Wprowadź kod błędu</CardTitle>
            <CardDescription>Wpisz kod DTC i wybierz pojazd do analizy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dtc-code">Kod DTC</Label>
                <Input
                  id="dtc-code"
                  placeholder="np. P0171, P0300"
                  value={dtcCode}
                  onChange={(e) => setDtcCode(e.target.value)}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vehicle">Pojazd</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddVehicleDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nowy pojazd
                  </Button>
                </div>
                <Select
                  value={selectedVehicleId?.toString()}
                  onValueChange={(value) => setSelectedVehicleId(parseInt(value))}
                >
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Wybierz pojazd" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle: any) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.brand} {vehicle.model} ({vehicle.vin})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handleAnalyze} 
              className="w-full md:w-auto"
              disabled={analyzeMutation.isPending}
            >
              {analyzeMutation.isPending ? (
                <>Analizuję...</>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analizuj kod
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6 animate-fade-in">
            {/* Description */}
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Opis błędu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{analysisResult.description}</p>
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Lista rzeczy do sprawdzenia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.checklist.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Probable Causes */}
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  Prawdopodobne przyczyny
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.probableCauses.map((cause: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{cause.cause}</span>
                        <span className="text-primary font-bold">{cause.probability}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${cause.probability}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Estimate */}
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Szacunkowe koszty naprawy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Koszt części</p>
                    <p className="text-2xl font-bold text-primary">
                      {analysisResult.estimatedCostMin} - {analysisResult.estimatedCostMax} PLN
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Robocizna</p>
                    <p className="text-2xl font-bold text-primary">{analysisResult.laborCost} PLN</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Łącznie (szacunkowo)</p>
                    <p className="text-2xl font-bold text-primary">
                      {analysisResult.estimatedCostMin + analysisResult.laborCost} - {analysisResult.estimatedCostMax + analysisResult.laborCost} PLN
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risks */}
            <Card className="bmw-card border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Zagrożenia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.risks.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tuning Compatibility */}
            <Card className="bmw-card">
              <CardHeader>
                <CardTitle>Kompatybilność z tuningiem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="font-medium">Możliwość tuningu:</span>
                  <span className={analysisResult.tuningCompatibility.canTune ? "text-green-500" : "text-destructive"}>
                    {analysisResult.tuningCompatibility.canTune ? "TAK" : "NIE"}
                  </span>
                </div>
                <div className="space-y-2">
                  <p><strong>Stage 1:</strong> {analysisResult.tuningCompatibility.stage1}</p>
                  <p><strong>Stage 2:</strong> {analysisResult.tuningCompatibility.stage2}</p>
                  {analysisResult.tuningCompatibility.mustRepairFirst && (
                    <p className="text-destructive font-medium">
                      ⚠️ Wymagana naprawa przed wykonaniem tuningu
                    </p>
                  )}
                </div>
                <div>
                  <p className="font-medium mb-2">Wymagane logi:</p>
                  <ul className="space-y-1">
                    {analysisResult.tuningCompatibility.requiredLogs.map((log: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">• {log}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dodaj nowy pojazd</DialogTitle>
            <DialogDescription>
              Wprowadź dane pojazdu do bazy
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN *</Label>
              <Input
                id="vin"
                placeholder="WBA3B5C50DF123456"
                value={newVehicle.vin}
                onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                maxLength={17}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marka</Label>
                <Input
                  id="brand"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="330i"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Rok produkcji</Label>
                <Input
                  id="year"
                  type="number"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Przebieg (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={newVehicle.mileage}
                  onChange={(e) => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="engine">Silnik</Label>
              <Input
                id="engine"
                placeholder="B48 2.0L Turbo"
                value={newVehicle.engine}
                onChange={(e) => setNewVehicle({ ...newVehicle, engine: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Skrzynia biegów</Label>
              <Input
                id="transmission"
                placeholder="8-speed automatic"
                value={newVehicle.transmission}
                onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Numer rejestracyjny</Label>
              <Input
                id="licensePlate"
                placeholder="WA 12345"
                value={newVehicle.licensePlate}
                onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVehicleDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddVehicle} disabled={createVehicleMutation.isPending}>
              {createVehicleMutation.isPending ? "Dodawanie..." : "Dodaj pojazd"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
