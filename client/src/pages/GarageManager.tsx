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
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Car, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function GarageManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newVehicle, setNewVehicle] = useState({
    clientId: 0,
    vin: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    engine: "",
    transmission: "",
    licensePlate: "",
  });

  const { data: vehicles = [], refetch } = trpc.vehicles.list.useQuery();
  const { data: clients = [] } = trpc.clients.list.useQuery();

  const createVehicleMutation = trpc.vehicles.create.useMutation({
    onSuccess: () => {
      toast.success("Pojazd dodany pomyślnie");
      setIsAddDialogOpen(false);
      refetch();
      setNewVehicle({
        clientId: 0,
        vin: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        mileage: 0,
        engine: "",
        transmission: "",
        licensePlate: "",
      });
    },
    onError: (error) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const handleAddVehicle = () => {
    if (!newVehicle.vin || !newVehicle.brand || !newVehicle.model || !newVehicle.clientId) {
      toast.error("Wypełnij wszystkie wymagane pola");
      return;
    }
    createVehicleMutation.mutate(newVehicle);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const query = searchQuery.toLowerCase();
    return (
      vehicle.vin.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.licensePlate?.toLowerCase().includes(query)
    );
  });

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
                <Car className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Garage Manager</h1>
                  <p className="text-sm text-muted-foreground">Zarządzanie pojazdami klientów</p>
                </div>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj pojazd
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Dodaj nowy pojazd</DialogTitle>
                  <DialogDescription>Wprowadź dane pojazdu do systemu</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Klient *</Label>
                      <select
                        id="client"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={newVehicle.clientId}
                        onChange={(e) => setNewVehicle({ ...newVehicle, clientId: parseInt(e.target.value) })}
                      >
                        <option value={0}>Wybierz klienta</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN *</Label>
                      <Input
                        id="vin"
                        placeholder="17-znakowy VIN"
                        maxLength={17}
                        value={newVehicle.vin}
                        onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value.toUpperCase() })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marka *</Label>
                      <Input
                        id="brand"
                        placeholder="np. BMW"
                        value={newVehicle.brand}
                        onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        placeholder="np. M3"
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Rocznik</Label>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="engine">Silnik</Label>
                      <Input
                        id="engine"
                        placeholder="np. 3.0 TwinTurbo"
                        value={newVehicle.engine}
                        onChange={(e) => setNewVehicle({ ...newVehicle, engine: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Skrzynia</Label>
                      <Input
                        id="transmission"
                        placeholder="np. Automatyczna"
                        value={newVehicle.transmission}
                        onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">Numer rejestracyjny</Label>
                    <Input
                      id="licensePlate"
                      placeholder="np. WA 12345"
                      value={newVehicle.licensePlate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <Button onClick={handleAddVehicle} className="w-full" disabled={createVehicleMutation.isPending}>
                    {createVehicleMutation.isPending ? "Dodawanie..." : "Dodaj pojazd"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Search */}
        <Card className="bmw-card mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj po VIN, marce, modelu lub numerze rejestracyjnym..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/vehicle/${vehicle.id}`}>
              <Card className="bmw-card hover:border-primary/50 transition-all cursor-pointer group h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {vehicle.brand} {vehicle.model}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {vehicle.year} • {vehicle.engine || "N/A"}
                      </CardDescription>
                    </div>
                    <Car className="w-8 h-8 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VIN:</span>
                    <span className="font-mono">{vehicle.vin}</span>
                  </div>
                  {vehicle.licensePlate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rejestracja:</span>
                      <span className="font-semibold">{vehicle.licensePlate}</span>
                    </div>
                  )}
                  {vehicle.mileage && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Przebieg:</span>
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skrzynia:</span>
                      <span>{vehicle.transmission}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <Card className="bmw-card">
            <CardContent className="py-12 text-center">
              <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brak pojazdów</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Nie znaleziono pojazdów spełniających kryteria wyszukiwania" : "Dodaj pierwszy pojazd do systemu"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj pojazd
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
