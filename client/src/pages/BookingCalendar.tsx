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
import { ArrowLeft, Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { toast } from "sonner";

export default function BookingCalendar() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    clientId: 0,
    vehicleId: 0,
    serviceType: "diagnostics" as const,
    scheduledDate: "",
    scheduledTime: "",
    duration: 120,
    notes: "",
  });

  const { data: bookings = [], refetch } = trpc.bookings.list.useQuery();
  const { data: clients = [] } = trpc.clients.list.useQuery();
  const { data: vehicles = [] } = trpc.vehicles.list.useQuery();

  const createBookingMutation = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("Rezerwacja utworzona pomyślnie");
      setIsAddDialogOpen(false);
      refetch();
      setNewBooking({
        clientId: 0,
        vehicleId: 0,
        serviceType: "diagnostics",
        scheduledDate: "",
        scheduledTime: "",
        duration: 120,
        notes: "",
      });
    },
    onError: (error) => {
      toast.error(`Błąd: ${error.message}`);
    },
  });

  const handleAddBooking = () => {
    if (!newBooking.clientId || !newBooking.scheduledDate || !newBooking.scheduledTime) {
      toast.error("Wypełnij wszystkie wymagane pola");
      return;
    }

    const scheduledDateTime = new Date(`${newBooking.scheduledDate}T${newBooking.scheduledTime}`);

    createBookingMutation.mutate({
      clientId: newBooking.clientId,
      vehicleId: newBooking.vehicleId || undefined,
      serviceType: newBooking.serviceType,
      scheduledDate: scheduledDateTime,
      duration: newBooking.duration,
      notes: newBooking.notes || undefined,
    });
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      coding: "Kodowanie BMW",
      stage1: "Chiptuning Stage 1",
      stage2: "Chiptuning Stage 2",
      xhp: "Optymalizacja skrzyni xHP",
      diagnostics: "Diagnostyka",
      repair: "Naprawa",
      other: "Inne",
    };
    return labels[type] || type;
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "status-waiting-parts",
      confirmed: "status-in-progress",
      completed: "status-completed",
      cancelled: "status-completed",
    };
    return `status-badge ${statusMap[status] || ""}`;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Oczekująca",
      confirmed: "Potwierdzona",
      completed: "Zakończona",
      cancelled: "Anulowana",
    };
    return labels[status] || status;
  };

  const clientVehicles = vehicles.filter((v) => v.clientId === newBooking.clientId);

  const upcomingBookings = bookings.filter((b) => 
    new Date(b.scheduledDate) >= new Date() && (b.status === "pending" || b.status === "confirmed")
  );

  const pastBookings = bookings.filter((b) => 
    new Date(b.scheduledDate) < new Date() || b.status === "completed" || b.status === "cancelled"
  );

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
                <CalendarIcon className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Booking Engine</h1>
                  <p className="text-sm text-muted-foreground">Kalendarz rezerwacji i wizyt</p>
                </div>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nowa rezerwacja
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nowa rezerwacja</DialogTitle>
                  <DialogDescription>Zarezerwuj termin wizyty dla klienta</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Klient *</Label>
                    <select
                      id="client"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={newBooking.clientId}
                      onChange={(e) => setNewBooking({ ...newBooking, clientId: parseInt(e.target.value), vehicleId: 0 })}
                    >
                      <option value={0}>Wybierz klienta</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newBooking.clientId > 0 && clientVehicles.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">Pojazd (opcjonalnie)</Label>
                      <select
                        id="vehicle"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={newBooking.vehicleId}
                        onChange={(e) => setNewBooking({ ...newBooking, vehicleId: parseInt(e.target.value) })}
                      >
                        <option value={0}>Wybierz pojazd</option>
                        {clientVehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} ({vehicle.vin})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Typ usługi *</Label>
                    <Select
                      value={newBooking.serviceType}
                      onValueChange={(value: any) => setNewBooking({ ...newBooking, serviceType: value })}
                    >
                      <SelectTrigger id="serviceType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coding">Kodowanie BMW</SelectItem>
                        <SelectItem value="stage1">Chiptuning Stage 1</SelectItem>
                        <SelectItem value="stage2">Chiptuning Stage 2</SelectItem>
                        <SelectItem value="xhp">Optymalizacja skrzyni xHP</SelectItem>
                        <SelectItem value="diagnostics">Diagnostyka</SelectItem>
                        <SelectItem value="repair">Naprawa</SelectItem>
                        <SelectItem value="other">Inne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newBooking.scheduledDate}
                        onChange={(e) => setNewBooking({ ...newBooking, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Godzina *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newBooking.scheduledTime}
                        onChange={(e) => setNewBooking({ ...newBooking, scheduledTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Czas trwania (minuty)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newBooking.duration}
                      onChange={(e) => setNewBooking({ ...newBooking, duration: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Uwagi</Label>
                    <textarea
                      id="notes"
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                      value={newBooking.notes}
                      onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                      placeholder="Dodatkowe informacje o wizycie..."
                    />
                  </div>

                  <Button onClick={handleAddBooking} className="w-full" disabled={createBookingMutation.isPending}>
                    {createBookingMutation.isPending ? "Tworzenie..." : "Utwórz rezerwację"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Upcoming Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Nadchodzące wizyty</h2>
          {upcomingBookings.length === 0 ? (
            <Card className="bmw-card">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Brak nadchodzących wizyt</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map((booking) => {
                const client = clients.find((c) => c.id === booking.clientId);
                const vehicle = booking.vehicleId ? vehicles.find((v) => v.id === booking.vehicleId) : null;

                return (
                  <Card key={booking.id} className="bmw-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{client?.name || "Nieznany klient"}</CardTitle>
                          <CardDescription>{getServiceTypeLabel(booking.serviceType)}</CardDescription>
                        </div>
                        <span className={getStatusBadgeClass(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        <span>{new Date(booking.scheduledDate).toLocaleDateString("pl-PL")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{new Date(booking.scheduledDate).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="text-muted-foreground">({booking.duration} min)</span>
                      </div>
                      {vehicle && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Pojazd: </span>
                          <span>{vehicle.brand} {vehicle.model}</span>
                        </div>
                      )}
                      {booking.notes && (
                        <div className="text-sm text-muted-foreground border-t border-border pt-2 mt-2">
                          {booking.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Historia wizyt</h2>
          {pastBookings.length === 0 ? (
            <Card className="bmw-card">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Brak historii wizyt</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.slice(0, 10).map((booking) => {
                const client = clients.find((c) => c.id === booking.clientId);
                const vehicle = booking.vehicleId ? vehicles.find((v) => v.id === booking.vehicleId) : null;

                return (
                  <Card key={booking.id} className="bmw-card">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-semibold">{client?.name || "Nieznany klient"}</p>
                              <p className="text-sm text-muted-foreground">{getServiceTypeLabel(booking.serviceType)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm">{new Date(booking.scheduledDate).toLocaleDateString("pl-PL")}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(booking.scheduledDate).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <span className={getStatusBadgeClass(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      </div>
                      {vehicle && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {vehicle.brand} {vehicle.model} • {vehicle.vin}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
