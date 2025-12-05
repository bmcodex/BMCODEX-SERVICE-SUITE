import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Car, FileText, Image, Code, AlertCircle, Calendar } from "lucide-react";

export default function VehicleDetails() {
  const [, params] = useRoute("/vehicle/:id");
  const vehicleId = parseInt(params?.id || "0");

  const { data: vehicle, isLoading } = trpc.vehicles.getById.useQuery({ id: vehicleId });
  const { data: projects = [] } = trpc.projects.getByVehicleId.useQuery({ vehicleId });
  const { data: dtcCodes = [] } = trpc.dtc.getByVehicleId.useQuery({ vehicleId });
  const { data: softwareFiles = [] } = trpc.software.getByVehicleId.useQuery({ vehicleId });
  const { data: media = [] } = trpc.media.getByVehicleId.useQuery({ vehicleId });
  const { data: protocols = [] } = trpc.protocols.getByVehicleId.useQuery({ vehicleId });
  const { data: serviceHistory = [] } = trpc.serviceHistory.getByVehicleId.useQuery({ vehicleId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bmw-card max-w-md">
          <CardHeader>
            <CardTitle>Pojazd nie znaleziony</CardTitle>
            <CardDescription>Nie znaleziono pojazdu o podanym ID</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/garage">
              <Button>Powrót do listy pojazdów</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      received: "status-received",
      in_progress: "status-in-progress",
      waiting_parts: "status-waiting-parts",
      ready_pickup: "status-ready-pickup",
      completed: "status-completed",
    };
    return `status-badge ${statusMap[status] || ""}`;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      received: "Przyjęty",
      in_progress: "W trakcie",
      waiting_parts: "Czeka na części",
      ready_pickup: "Gotowy do odbioru",
      completed: "Zakończony",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/garage">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-sm text-muted-foreground">VIN: {vehicle.vin}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Vehicle Info Card */}
        <Card className="bmw-card mb-6">
          <CardHeader>
            <CardTitle>Informacje o pojeździe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Marka i model</p>
                <p className="font-semibold">{vehicle.brand} {vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rocznik</p>
                <p className="font-semibold">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Silnik</p>
                <p className="font-semibold">{vehicle.engine || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skrzynia</p>
                <p className="font-semibold">{vehicle.transmission || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Przebieg</p>
                <p className="font-semibold">{vehicle.mileage?.toLocaleString() || "N/A"} km</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
                <p className="font-semibold">{vehicle.licensePlate || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kolor</p>
                <p className="font-semibold">{vehicle.color || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VIN</p>
                <p className="font-semibold font-mono text-xs">{vehicle.vin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="projects">Projekty ({projects.length})</TabsTrigger>
            <TabsTrigger value="dtc">DTC ({dtcCodes.length})</TabsTrigger>
            <TabsTrigger value="software">Softy ({softwareFiles.length})</TabsTrigger>
            <TabsTrigger value="media">Media ({media.length})</TabsTrigger>
            <TabsTrigger value="protocols">Protokoły ({protocols.length})</TabsTrigger>
            <TabsTrigger value="history">Historia ({serviceHistory.length})</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {projects.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak projektów dla tego pojazdu</p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="bmw-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <span className={getStatusBadgeClass(project.status)}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Typ usługi</p>
                        <p className="font-medium">{project.serviceType}</p>
                      </div>
                      {project.startDate && (
                        <div>
                          <p className="text-muted-foreground">Data rozpoczęcia</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString("pl-PL")}</p>
                        </div>
                      )}
                      {project.estimatedCost && (
                        <div>
                          <p className="text-muted-foreground">Szacowany koszt</p>
                          <p className="font-medium">{project.estimatedCost} PLN</p>
                        </div>
                      )}
                      {project.finalCost && (
                        <div>
                          <p className="text-muted-foreground">Koszt końcowy</p>
                          <p className="font-medium">{project.finalCost} PLN</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* DTC Codes Tab */}
          <TabsContent value="dtc" className="space-y-4">
            {dtcCodes.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak kodów DTC dla tego pojazdu</p>
                </CardContent>
              </Card>
            ) : (
              dtcCodes.map((dtc) => (
                <Card key={dtc.id} className="bmw-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-primary" />
                          {dtc.code}
                        </CardTitle>
                        <CardDescription>{dtc.description}</CardDescription>
                      </div>
                      {dtc.resolved ? (
                        <span className="status-badge status-completed">Rozwiązany</span>
                      ) : (
                        <span className="status-badge status-in-progress">Aktywny</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {dtc.estimatedCostMin && dtc.estimatedCostMax && (
                        <div>
                          <p className="text-muted-foreground">Szacowany koszt</p>
                          <p className="font-medium">{dtc.estimatedCostMin} - {dtc.estimatedCostMax} PLN</p>
                        </div>
                      )}
                      {dtc.laborCost && (
                        <div>
                          <p className="text-muted-foreground">Robocizna</p>
                          <p className="font-medium">{dtc.laborCost} PLN</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Data wykrycia</p>
                        <p className="font-medium">{new Date(dtc.createdAt).toLocaleDateString("pl-PL")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Software Files Tab */}
          <TabsContent value="software" className="space-y-4">
            {softwareFiles.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <Code className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak plików software dla tego pojazdu</p>
                </CardContent>
              </Card>
            ) : (
              softwareFiles.map((file) => (
                <Card key={file.id} className="bmw-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="w-5 h-5 text-primary" />
                          {file.fileName}
                        </CardTitle>
                        <CardDescription>
                          {file.fileType.replace("_", " ").toUpperCase()}
                          {file.version && ` • Wersja: ${file.version}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Data wgrania</p>
                        <p className="font-medium">{new Date(file.uploadedAt).toLocaleDateString("pl-PL")}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                          Pobierz
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4">
            {media.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <Image className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak mediów dla tego pojazdu</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {media.map((item) => (
                  <Card key={item.id} className="bmw-card">
                    <CardHeader>
                      <CardTitle className="text-sm">{item.fileName || "Media"}</CardTitle>
                      <CardDescription>{item.category || item.mediaType}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {item.mediaType === "photo" && (
                        <img src={item.fileUrl} alt={item.fileName || "Zdjęcie"} className="w-full rounded-lg" />
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(item.uploadedAt).toLocaleDateString("pl-PL")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Protocols Tab */}
          <TabsContent value="protocols" className="space-y-4">
            {protocols.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak protokołów dla tego pojazdu</p>
                </CardContent>
              </Card>
            ) : (
              protocols.map((protocol) => (
                <Card key={protocol.id} className="bmw-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>
                          Protokół {protocol.protocolType === "intake" ? "przyjęcia" : "wydania"}
                        </CardTitle>
                        <CardDescription>
                          {new Date(protocol.createdAt).toLocaleDateString("pl-PL")}
                        </CardDescription>
                      </div>
                      {protocol.pdfFileUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={protocol.pdfFileUrl} target="_blank" rel="noopener noreferrer">
                            Pobierz PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Service History Tab */}
          <TabsContent value="history" className="space-y-4">
            {serviceHistory.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak historii serwisowej dla tego pojazdu</p>
                </CardContent>
              </Card>
            ) : (
              serviceHistory.map((entry) => (
                <Card key={entry.id} className="bmw-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{entry.serviceType}</CardTitle>
                        <CardDescription>{entry.description}</CardDescription>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.serviceDate).toLocaleDateString("pl-PL")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {entry.mileageAtService && (
                        <div>
                          <p className="text-muted-foreground">Przebieg</p>
                          <p className="font-medium">{entry.mileageAtService.toLocaleString()} km</p>
                        </div>
                      )}
                      {entry.cost && (
                        <div>
                          <p className="text-muted-foreground">Koszt</p>
                          <p className="font-medium">{entry.cost} PLN</p>
                        </div>
                      )}
                      {entry.performedBy && (
                        <div>
                          <p className="text-muted-foreground">Wykonał</p>
                          <p className="font-medium">{entry.performedBy}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
