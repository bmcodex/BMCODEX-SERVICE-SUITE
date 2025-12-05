import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Clients() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const { data: clients, isLoading, refetch } = trpc.clients.list.useQuery();
  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast.success("Klient został dodany");
      setIsAddDialogOpen(false);
      setNewClient({ name: "", email: "", phone: "", address: "", notes: "" });
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  // const deleteMutation = trpc.clients.delete.useMutation({
  //   onSuccess: () => {
  //     toast.success("Klient został usunięty");
  //     refetch();
  //   },
  //   onError: (error: any) => {
  //     toast.error(`Błąd: ${error.message}`);
  //   },
  // });

  const handleAddClient = () => {
    if (!newClient.name) {
      toast.error("Nazwa klienta jest wymagana");
      return;
    }

    createMutation.mutate(newClient);
  };

  const handleDeleteClient = (id: number, name: string) => {
    // TODO: Implement delete functionality
    toast.info("Funkcja usuwania będzie dostępna wkrótce");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Zarządzanie Klientami</h1>
              <p className="text-muted-foreground">
                Zarządzaj bazą klientów i ich danymi kontaktowymi
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj klienta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Dodaj nowego klienta</DialogTitle>
                  <DialogDescription>
                    Wprowadź dane kontaktowe nowego klienta
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Imię i nazwisko *</Label>
                    <Input
                      id="name"
                      placeholder="np. Jan Kowalski"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jan.kowalski@example.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      placeholder="+48 123 456 789"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Input
                      id="address"
                      placeholder="ul. Główna 1, 00-001 Warszawa"
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notatki</Label>
                    <Textarea
                      id="notes"
                      placeholder="Dodatkowe informacje o kliencie..."
                      value={newClient.notes}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Anuluj
                  </Button>
                  <Button onClick={handleAddClient} disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Dodawanie..." : "Dodaj klienta"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Clients List */}
      <div className="container py-8">
        {!clients || clients.length === 0 ? (
          <Card className="bmw-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Brak klientów w bazie danych</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj pierwszego klienta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="bmw-card hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{client.name}</CardTitle>
                      <CardDescription>ID: {client.id}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/client/${client.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id, client.name)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href={`mailto:${client.email}`} className="hover:underline">
                        {client.email}
                      </a>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href={`tel:${client.phone}`} className="hover:underline">
                        {client.phone}
                      </a>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{client.address}</span>
                    </div>
                  )}
                  {client.notes && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground line-clamp-2">{client.notes}</p>
                    </div>
                  )}
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/client/${client.id}`}>Zobacz szczegóły</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
