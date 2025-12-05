import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Wrench, Calendar, DollarSign, Trash2, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Projects() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    vehicleId: 0,
    clientId: 0,
    title: "",
    description: "",
    serviceType: "diagnostics" as const,
    status: "received" as const,
    estimatedCost: 0,
  });

  const { data: projects, isLoading, refetch } = trpc.projects.list.useQuery();
  const { data: vehicles } = trpc.vehicles.list.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const createMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Projekt został utworzony");
      setIsAddDialogOpen(false);
      setNewProject({
        vehicleId: 0,
        clientId: 0,
        title: "",
        description: "",
        serviceType: "diagnostics",
        status: "received",
        estimatedCost: 0,
      });
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("Projekt został usunięty");
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const handleAddProject = () => {
    if (!newProject.title || !newProject.vehicleId || !newProject.clientId) {
      toast.error("Tytuł, pojazd i klient są wymagane");
      return;
    }
    createMutation.mutate(newProject);
  };

  const handleDeleteClick = (projectId: number) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate({ id: projectToDelete });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-500/20 text-green-400",
      in_progress: "bg-blue-500/20 text-blue-400",
      ready_pickup: "bg-purple-500/20 text-purple-400",
      waiting_parts: "bg-yellow-500/20 text-yellow-400",
      received: "bg-gray-500/20 text-gray-400",
    };
    const labels = {
      completed: "Zakończony",
      in_progress: "W trakcie",
      ready_pickup: "Gotowy",
      waiting_parts: "Czeka na części",
      received: "Przyjęty",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrót
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Projekty</h1>
                <p className="text-muted-foreground">Zarządzaj projektami serwisowymi</p>
              </div>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nowy projekt
            </Button>
          </div>
        </div>
      </header>

      {/* Projects List */}
      <div className="container py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !projects || projects.length === 0 ? (
          <Card className="bmw-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Brak projektów w bazie danych</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Utwórz pierwszy projekt
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project: any) => {
              const vehicle = vehicles?.find((v: any) => v.id === project.vehicleId);
              const client = clients?.find((c: any) => c.id === project.clientId);
              
              return (
                <Card key={project.id} className="bmw-card hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle>{project.title}</CardTitle>
                          {getStatusBadge(project.status)}
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                        {vehicle && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Pojazd: {vehicle.brand} {vehicle.model} ({vehicle.vin})
                          </p>
                        )}
                        {client && (
                          <p className="text-sm text-muted-foreground">
                            Klient: {client.name}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Typ usługi</p>
                          <p className="text-sm font-medium capitalize">{project.serviceType}</p>
                        </div>
                      </div>
                      {project.startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Data rozpoczęcia</p>
                            <p className="text-sm font-medium">
                              {new Date(project.startDate).toLocaleDateString("pl-PL")}
                            </p>
                          </div>
                        </div>
                      )}
                      {project.estimatedCost && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Szacowany koszt</p>
                            <p className="text-sm font-medium">{project.estimatedCost.toLocaleString()} PLN</p>
                          </div>
                        </div>
                      )}
                      {project.finalCost && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Koszt końcowy</p>
                            <p className="text-sm font-medium">{project.finalCost.toLocaleString()} PLN</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Utwórz nowy projekt</DialogTitle>
            <DialogDescription>
              Wprowadź dane nowego projektu serwisowego
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Klient *</Label>
                <Select
                  value={newProject.clientId.toString()}
                  onValueChange={(value) => setNewProject({ ...newProject, clientId: parseInt(value) })}
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Wybierz klienta" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Pojazd *</Label>
                <Select
                  value={newProject.vehicleId.toString()}
                  onValueChange={(value) => setNewProject({ ...newProject, vehicleId: parseInt(value) })}
                >
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Wybierz pojazd" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles?.map((vehicle: any) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.brand} {vehicle.model} ({vehicle.vin})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Tytuł projektu *</Label>
              <Input
                id="title"
                placeholder="np. Chiptuning Stage 1 + xHP"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                placeholder="Szczegółowy opis prac do wykonania..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Typ usługi</Label>
                <Select
                  value={newProject.serviceType}
                  onValueChange={(value: any) => setNewProject({ ...newProject, serviceType: value })}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diagnostics">Diagnostyka</SelectItem>
                    <SelectItem value="coding">Kodowanie BMW</SelectItem>
                    <SelectItem value="chiptuning">Chiptuning</SelectItem>
                    <SelectItem value="xhp">xHP Transmission</SelectItem>
                    <SelectItem value="repair">Naprawa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Szacowany koszt (PLN)</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  placeholder="0"
                  value={newProject.estimatedCost}
                  onChange={(e) => setNewProject({ ...newProject, estimatedCost: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddProject} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Tworzenie..." : "Utwórz projekt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Potwierdź usunięcie
            </AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć ten projekt? Ta operacja jest nieodwracalna.
              Wszystkie powiązane protokoły również zostaną usunięte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Usuń projekt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
