import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DtcAnalyzer from "./pages/DtcAnalyzer";
import GarageManager from "./pages/GarageManager";
import VehicleDetails from "./pages/VehicleDetails";
import BookingCalendar from "./pages/BookingCalendar";
import Protocols from "./pages/Protocols";
import ProtocolDetails from "./pages/ProtocolDetails";
import Dashboard from "./pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/dtc-analyzer"} component={DtcAnalyzer} />
      <Route path={"/garage"} component={GarageManager} />
      <Route path={"/vehicle/:id"} component={VehicleDetails} />
      <Route path={"/booking"} component={BookingCalendar} />
       <Route path="/protocols" component={Protocols} />
      <Route path="/protocol/:id" component={ProtocolDetails} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
