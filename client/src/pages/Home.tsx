import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { 
  Car, 
  Calendar, 
  FileText, 
  Search, 
  Wrench,
  ArrowRight,
  LogOut,
  Users
} from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md bmw-card">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Wrench className="w-16 h-16 mx-auto text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">BMCODEX Service Suite™</CardTitle>
            <CardDescription className="text-muted-foreground">
              System zarządzania serwisem BMW
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Zaloguj się
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">BMCODEX Service Suite™</h1>
                <p className="text-sm text-muted-foreground">System zarządzania serwisem</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Witaj, <span className="text-foreground font-medium">{user?.name || user?.email}</span>
              </span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Wyloguj
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-background to-card/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Profesjonalne zarządzanie <span className="text-primary">serwisem BMW</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Kompleksowy system do diagnostyki, tuningu i zarządzania projektami serwisowymi
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dtc-analyzer">
              <Card className="bmw-card hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">DTC Analyzer Pro</CardTitle>
                  <CardDescription>
                    Diagnostyka kodów błędów OBD2 z analizą kosztów i zagrożeń
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Otwórz moduł <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/garage">
              <Card className="bmw-card hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Garage Manager</CardTitle>
                  <CardDescription>
                    Zarządzanie pojazdami, historia wizyt i archiwum softów
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Otwórz moduł <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/booking">
              <Card className="bmw-card hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Booking Engine</CardTitle>
                  <CardDescription>
                    Rezerwacje, kalendarz wizyt i powiadomienia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Otwórz moduł <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/protocols">
              <Card className="bmw-card hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Protocol Pro</CardTitle>
                  <CardDescription>
                    Protokoły przyjęcia/wydania z generowaniem PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Otwórz moduł <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/clients">
              <Card className="bmw-card hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Zarządzanie Klientami</CardTitle>
                  <CardDescription>
                    Baza klientów i dane kontaktowe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Otwórz moduł <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-card/30">
        <div className="container">
          <h3 className="text-2xl font-bold mb-8 text-center">Funkcje systemu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Zaawansowana diagnostyka</h4>
              <p className="text-sm text-muted-foreground">
                Analiza kodów DTC z prawdopodobnymi przyczynami, kosztami naprawy i oceną ryzyka
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Pełna historia pojazdu</h4>
              <p className="text-sm text-muted-foreground">
                Kartoteki pojazdów z historią wizyt, archiwum softów ECU/TCU i galerią zdjęć
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Profesjonalne protokoły</h4>
              <p className="text-sm text-muted-foreground">
                Protokoły przyjęcia i wydania z podpisem klienta i automatycznym PDF
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 BMCODEX Service Suite™. Wszystkie prawa zastrzeżone.</p>
          <p className="mt-2">Autor: Michał Nurzyński</p>
        </div>
      </footer>
    </div>
  );
}
