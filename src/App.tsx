
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import RoomsPage from "./pages/RoomsPage";
import DeluxeRoom from "./pages/rooms/DeluxeRoom";
import StandardRoom from "./pages/rooms/StandardRoom";
import ExecutiveSuite from "./pages/rooms/ExecutiveSuite";
import TwinRoom from "./pages/rooms/TwinRoom";
import LuxurySuite from "./pages/rooms/LuxurySuite";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/deluxe" element={<DeluxeRoom />} />
          <Route path="/rooms/standard" element={<StandardRoom />} />
          <Route path="/rooms/executive" element={<ExecutiveSuite />} />
          <Route path="/rooms/twin" element={<TwinRoom />} />
          <Route path="/rooms/luxury-suite" element={<LuxurySuite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
