import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import RoomsPage from "./pages/RoomsPage";
import CheckAvailability from "./pages/CheckAvailability";
import ReservationsPage from "./pages/ReservationsPage";
import ContactPage from "./pages/ContactPage";
import AboutUs from "./pages/AboutUs";
import Amenities from "./pages/Amenities";
import Gallery from "./pages/Gallery";
import FAQs from "./pages/FAQs";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomManagement from "./pages/admin/RoomManagement";
import FinancialReports from "./pages/admin/FinancialReports";
import ReservationManagement from "./pages/admin/ReservationManagement";
import UserDashboard from "./pages/UserDashboard";
import { AuthProvider } from "./context/AuthContext";
import RoomDetail from "./pages/RoomDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:type/:id" element={<RoomDetail />} />
            <Route path="/check-availability" element={<CheckAvailability />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faqs" element={<FAQs />} />
            
            {/* User Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute requiredRole="MANAGER">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/room-management" 
              element={
                <PrivateRoute requiredRole="MANAGER">
                  <RoomManagement />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/financial" 
              element={
                <PrivateRoute requiredRole="MANAGER">
                  <FinancialReports />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/reservations" 
              element={
                <PrivateRoute requiredRole="MANAGER">
                  <ReservationManagement />
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
