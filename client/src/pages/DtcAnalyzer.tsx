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
import { ArrowLeft, Search, AlertTriangle, CheckCircle2, Wrench, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function DtcAnalyzer() {
  const [dtcCode, setDtcCode] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const { data: vehicles = [] } = trpc.vehicles.list.useQuery();
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
                <Label htmlFor="vehicle">Pojazd</Label>
                <Select
                  value={selectedVehicleId?.toString() || ""}
                  onValueChange={(value) => setSelectedVehicleId(parseInt(value))}
                >
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Wybierz pojazd" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
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
    </div>
  );
}
