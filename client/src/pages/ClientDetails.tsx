import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Car, 
  FileText, 
  Wrench,
  Calendar,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

export default function ClientDetails() {
  const { id } = useParams();
  const clientId = parseInt(id || "0");
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedClient, setEditedClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const { data: client, isLoading, refetch } = trpc.clients.getById.useQuery({ id: clientId });
  // TODO: Implement listByClient procedures
  const vehicles: any[] = [];
  const projects: any[] = [];
  const protocols: any[] = [];

  const updateMutation = trpc.clients.update.useMutation({
    onSuccess: () => {
      toast.success("Dane klienta zostały zaktualizowane");
      setIsEditDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const handleEditClick = () => {
    if (client) {
      setEditedClient({
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        notes: client.notes || "",
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateClient = () => {
    if (!editedClient.name) {
      toast.error("Nazwa klienta jest wymagana");
      return;
    }

    updateMutation.mutate({
      id: clientId,
      ...editedClient,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bmw-card max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Klient nie został znaleziony</p>
            <Button asChild>
              <Link href="/clients">Powrót do listy klientów</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProjects = projects?.length || 0;
  const completedProjects = projects?.filter((p: any) => p.status === "completed").length || 0;
  const totalSpent = projects?.reduce((sum: number, p: any) => sum + (p.finalCost || p.estimatedCost || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/clients">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrót
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{client.name}</h1>
                <p className="text-muted-foreground">ID klienta: {client.id}</p>
              </div>
            </div>
            <Button onClick={handleEditClick}>
              <Edit className="w-4 h-4 mr-2" />
              Edytuj dane
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bmw-card">
            <CardHeader className="pb-3">
              <CardDescription>Pojazdy</CardDescription>
              <CardTitle className="text-3xl">{vehicles?.length || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Car className="w-4 h-4 mr-2" />
                Zarejestrowanych pojazdów
              </div>
            </CardContent>
          </Card>

          <Card className="bmw-card">
            <CardHeader className="pb-3">
              <CardDescription>Projekty</CardDescription>
              <CardTitle className="text-3xl">{totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Wrench className="w-4 h-4 mr-2" />
                {completedProjects} zakończonych
              </div>
            </CardContent>
          </Card>

          <Card className="bmw-card">
            <CardHeader className="pb-3">
              <CardDescription>Łączne wydatki</CardDescription>
              <CardTitle className="text-3xl">{totalSpent.toLocaleString()} PLN</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                Wszystkie projekty
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="bmw-card mb-8">
          <CardHeader>
            <CardTitle>Dane kontaktowe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${client.email}`} className="hover:underline">
                    {client.email}
                  </a>
                </div>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <a href={`tel:${client.phone}`} className="hover:underline">
                    {client.phone}
                  </a>
                </div>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p>{client.address}</p>
                </div>
              </div>
            )}
            {client.notes && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Notatki</p>
                <p className="text-sm">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicles">Pojazdy ({vehicles?.length || 0})</TabsTrigger>
            <TabsTrigger value="projects">Projekty ({projects?.length || 0})</TabsTrigger>
            <TabsTrigger value="protocols">Protokoły ({protocols?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4">
            {!vehicles || vehicles.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Brak pojazdów dla tego klienta</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((vehicle: any) => (
                  <Card key={vehicle.id} className="bmw-card hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                      <CardDescription>VIN: {vehicle.vin}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Rok</p>
                          <p className="font-medium">{vehicle.year}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Przebieg</p>
                          <p className="font-medium">{vehicle.mileage?.toLocaleString()} km</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Silnik</p>
                          <p className="font-medium">{vehicle.engine}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Skrzynia</p>
                          <p className="font-medium">{vehicle.transmission}</p>
                        </div>
                      </div>
                      {vehicle.licensePlate && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
                          <p className="font-medium">{vehicle.licensePlate}</p>
                        </div>
                      )}
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link href={`/vehicle/${vehicle.id}`}>Zobacz szczegóły</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {!projects || projects.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Brak projektów dla tego klienta</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.map((project: any) => (
                  <Card key={project.id} className="bmw-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : project.status === "in_progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : project.status === "ready_pickup"
                              ? "bg-purple-500/20 text-purple-400"
                              : project.status === "waiting_parts"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {project.status === "completed" && "Zakończony"}
                          {project.status === "in_progress" && "W trakcie"}
                          {project.status === "ready_pickup" && "Gotowy"}
                          {project.status === "waiting_parts" && "Czeka na części"}
                          {project.status === "received" && "Przyjęty"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Typ usługi</p>
                          <p className="font-medium capitalize">{project.serviceType}</p>
                        </div>
                        {project.startDate && (
                          <div>
                            <p className="text-muted-foreground">Data rozpoczęcia</p>
                            <p className="font-medium">
                              {new Date(project.startDate).toLocaleDateString("pl-PL")}
                            </p>
                          </div>
                        )}
                        {project.estimatedCost && (
                          <div>
                            <p className="text-muted-foreground">Szacowany koszt</p>
                            <p className="font-medium">{project.estimatedCost.toLocaleString()} PLN</p>
                          </div>
                        )}
                        {project.finalCost && (
                          <div>
                            <p className="text-muted-foreground">Koszt końcowy</p>
                            <p className="font-medium">{project.finalCost.toLocaleString()} PLN</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Protocols Tab */}
          <TabsContent value="protocols" className="space-y-4">
            {!protocols || protocols.length === 0 ? (
              <Card className="bmw-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Brak protokołów dla tego klienta</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {protocols.map((protocol: any) => (
                  <Card key={protocol.id} className="bmw-card hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Protokół #{protocol.id}
                          </CardTitle>
                          <CardDescription>
                            {protocol.type === "intake" ? "Przyjęcie" : "Wydanie"}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(protocol.createdAt).toLocaleDateString("pl-PL")}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {protocol.notes && (
                        <p className="text-sm text-muted-foreground mb-4">{protocol.notes}</p>
                      )}
                      <Button variant="outline" asChild>
                        <Link href={`/protocol/${protocol.id}`}>Zobacz szczegóły</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edytuj dane klienta</DialogTitle>
            <DialogDescription>
              Zaktualizuj informacje kontaktowe klienta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Imię i nazwisko *</Label>
              <Input
                id="edit-name"
                value={editedClient.name}
                onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editedClient.email}
                onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefon</Label>
              <Input
                id="edit-phone"
                value={editedClient.phone}
                onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Adres</Label>
              <Input
                id="edit-address"
                value={editedClient.address}
                onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notatki</Label>
              <Textarea
                id="edit-notes"
                value={editedClient.notes}
                onChange={(e) => setEditedClient({ ...editedClient, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleUpdateClient} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
