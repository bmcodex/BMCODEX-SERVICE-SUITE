import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Car, Calendar, FileText, AlertCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: vehicles = [] } = trpc.vehicles.list.useQuery();
  const { data: projects = [] } = trpc.projects.list.useQuery();
  const { data: bookings = [] } = trpc.bookings.list.useQuery();
  const { data: clients = [] } = trpc.clients.list.useQuery();

  const activeProjects = projects.filter((p) => 
    p.status === "received" || p.status === "in_progress" || p.status === "waiting_parts"
  );

  const upcomingBookings = bookings.filter((b) => 
    new Date(b.scheduledDate) >= new Date() && (b.status === "pending" || b.status === "confirmed")
  );

  const completedProjects = projects.filter((p) => p.status === "completed");

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
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Przegląd systemu</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bmw-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pojazdy w systemie</CardTitle>
              <Car className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Zarejestrowanych pojazdów
              </p>
            </CardContent>
          </Card>

          <Card className="bmw-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktywne projekty</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                W trakcie realizacji
              </p>
            </CardContent>
          </Card>

          <Card className="bmw-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nadchodzące wizyty</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Zaplanowanych rezerwacji
              </p>
            </CardContent>
          </Card>

          <Card className="bmw-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Klienci</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Zarejestrowanych klientów
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Aktywne projekty</h2>
          {activeProjects.length === 0 ? (
            <Card className="bmw-card">
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Brak aktywnych projektów</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.slice(0, 6).map((project) => {
                const vehicle = vehicles.find((v) => v.id === project.vehicleId);
                const getStatusBadgeClass = (status: string) => {
                  const statusMap: Record<string, string> = {
                    received: "status-received",
                    in_progress: "status-in-progress",
                    waiting_parts: "status-waiting-parts",
                  };
                  return `status-badge ${statusMap[status] || ""}`;
                };

                const getStatusLabel = (status: string) => {
                  const labels: Record<string, string> = {
                    received: "Przyjęty",
                    in_progress: "W trakcie",
                    waiting_parts: "Czeka na części",
                  };
                  return labels[status] || status;
                };

                return (
                  <Card key={project.id} className="bmw-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>
                            {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Nieznany pojazd"}
                          </CardDescription>
                        </div>
                        <span className={getStatusBadgeClass(project.status)}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Typ:</span>
                          <span>{project.serviceType}</span>
                        </div>
                        {project.startDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rozpoczęto:</span>
                            <span>{new Date(project.startDate).toLocaleDateString("pl-PL")}</span>
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

        {/* Upcoming Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Najbliższe wizyty</h2>
          {upcomingBookings.length === 0 ? (
            <Card className="bmw-card">
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Brak nadchodzących wizyt</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 5).map((booking) => {
                const client = clients.find((c) => c.id === booking.clientId);
                const vehicle = booking.vehicleId ? vehicles.find((v) => v.id === booking.vehicleId) : null;

                return (
                  <Card key={booking.id} className="bmw-card">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-semibold">{client?.name || "Nieznany klient"}</p>
                              <p className="text-sm text-muted-foreground">
                                {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Bez pojazdu"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{new Date(booking.scheduledDate).toLocaleDateString("pl-PL")}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.scheduledDate).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
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
