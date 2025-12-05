import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, FileText, Plus, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Protocols() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProtocol, setNewProtocol] = useState({
    projectId: 0,
    vehicleId: 0,
    clientId: 0,
    protocolType: "intake" as "intake" | "release",
    clientNotes: "",
    clientConsents: "",
  });

  const { data: projects = [] } = trpc.projects.list.useQuery();
  const { data: vehicles = [] } = trpc.vehicles.list.useQuery();
  const { data: clients = [] } = trpc.clients.list.useQuery();

  const createProtocolMutation = trpc.protocols.create.useMutation({
    onSuccess: () => {
      toast.success("Protokół utworzony pomyślnie");
      setIsAddDialogOpen(false);
      setNewProtocol({
        projectId: 0,
        vehicleId: 0,
        clientId: 0,
        protocolType: "intake",
        clientNotes: "",
        clientConsents: "",
      });
    },
    onError: (error) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const handleAddProtocol = () => {
    if (!newProtocol.vehicleId || !newProtocol.clientId) {
      toast.error("Pojazd i klient są wymagane");
      return;
    }

    // projectId is optional now
    const protocolData = {
      ...newProtocol,
      projectId: newProtocol.projectId || undefined,
    };

    createProtocolMutation.mutate(protocolData as any);
  };

  const selectedProject = projects.find((p) => p.id === newProtocol.projectId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrót
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Protocol Pro</h1>
                  <p className="text-sm text-muted-foreground">Protokoły przyjęcia i wydania</p>
                </div>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nowy protokół
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nowy protokół</DialogTitle>
                  <DialogDescription>Utwórz protokół przyjęcia lub wydania pojazdu</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="protocolType">Typ protokołu *</Label>
                    <Select
                      value={newProtocol.protocolType}
                      onValueChange={(value: "intake" | "release") => setNewProtocol({ ...newProtocol, protocolType: value })}
                    >
                      <SelectTrigger id="protocolType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake">Protokół przyjęcia</SelectItem>
                        <SelectItem value="release">Protokół wydania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project">Projekt (opcjonalnie)</Label>
                    <select
                      id="project"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={newProtocol.projectId}
                      onChange={(e) => {
                        const projectId = parseInt(e.target.value);
                        const project = projects.find((p) => p.id === projectId);
                        if (project) {
                          setNewProtocol({
                            ...newProtocol,
                            projectId,
                            vehicleId: project.vehicleId,
                            clientId: project.clientId,
                          });
                        } else {
                          setNewProtocol({
                            ...newProtocol,
                            projectId: 0,
                          });
                        }
                      }}
                    >
                      <option value={0}>Bez projektu</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Możesz utworzyć protokół bez przypisania do projektu
                    </p>
                  </div>

                  {selectedProject && (
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Klient:</span>
                        <span className="font-medium">
                          {clients.find((c) => c.id === selectedProject.clientId)?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pojazd:</span>
                        <span className="font-medium">
                          {(() => {
                            const vehicle = vehicles.find((v) => v.id === selectedProject.vehicleId);
                            return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.vin})` : "N/A";
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Typ usługi:</span>
                        <span className="font-medium">{selectedProject.serviceType}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="clientNotes">Uwagi klienta</Label>
                    <textarea
                      id="clientNotes"
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                      value={newProtocol.clientNotes}
                      onChange={(e) => setNewProtocol({ ...newProtocol, clientNotes: e.target.value })}
                      placeholder="Uwagi i życzenia klienta..."
                    />
                  </div>

                  {newProtocol.protocolType === "intake" && (
                    <div className="space-y-2">
                      <Label htmlFor="clientConsents">Zgody klienta</Label>
                      <textarea
                        id="clientConsents"
                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                        value={newProtocol.clientConsents}
                        onChange={(e) => setNewProtocol({ ...newProtocol, clientConsents: e.target.value })}
                        placeholder="Lista zgód i potwierdzeń klienta..."
                      />
                    </div>
                  )}

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      <strong>Uwaga:</strong> Po utworzeniu protokołu będziesz mógł dodać zdjęcia 360°, zaznaczyć uszkodzenia i dodać podpis klienta.
                    </p>
                  </div>

                  <Button onClick={handleAddProtocol} className="w-full" disabled={createProtocolMutation.isPending}>
                    {createProtocolMutation.isPending ? "Tworzenie..." : "Utwórz protokół"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bmw-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Protokół przyjęcia
              </CardTitle>
              <CardDescription>
                Dokumentacja stanu pojazdu przy przyjęciu do serwisu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Dane pojazdu i klienta</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Zdjęcia 360° pojazdu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Zaznaczanie uszkodzeń na sylwetce</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Lista uwag i zgód</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Podpis klienta</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bmw-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Protokół wydania
              </CardTitle>
              <CardDescription>
                Dokumentacja wykonanych prac i stanu pojazdu przy wydaniu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Lista wykonanych prac</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Wgrane softy (ECU/TCU stock/mod)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Lista zmian i uwag</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Zdjęcia po realizacji</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Podpis klienta</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Feature Info */}
        <Card className="bmw-card">
          <CardHeader>
            <CardTitle>Generowanie PDF</CardTitle>
            <CardDescription>
              Wszystkie protokoły są automatycznie generowane jako PDF z brandingiem BMCODEX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Branding BMCODEX</h4>
                <p className="text-sm text-muted-foreground">
                  Ciemne tło z pomarańczowymi akcentami (#FF4500)
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Pobieranie i druk</h4>
                <p className="text-sm text-muted-foreground">
                  Możliwość pobrania i wydruku protokołu
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Automatyczny zapis</h4>
                <p className="text-sm text-muted-foreground">
                  Protokoły zapisywane w historii pojazdu
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <strong>Wskazówka:</strong> Protokoły można przeglądać w sekcji "Protokoły" na stronie szczegółów pojazdu w module Garage Manager.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
