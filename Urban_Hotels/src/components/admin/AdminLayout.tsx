import React, { useState, useEffect } from 'react';
import {
  Settings,
  Home,
  Users,
  ChevronDown,
  LogOut,
  CreditCard,
  BarChart,
  Bed,
  FileText,
  Hotel,
  CalendarDays,
  Bell
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdminAuthenticated || user?.role !== 'MANAGER') {
      navigate('/admin/login');
    }
  }, [navigate, user]);

  if (!user || user.role !== 'MANAGER') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin/login');
  };
  
  const navItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/admin/dashboard" },
    { name: "Room Management", icon: <Bed className="h-5 w-5" />, path: "/admin/room-management" },
    { name: "Financial Reports", icon: <BarChart className="h-5 w-5" />, path: "/admin/financial" },
    { name: "Reservations", icon: <CalendarDays className="h-5 w-5" />, path: "/admin/reservations" },
    { name: "Customers", icon: <Users className="h-5 w-5" />, path: "/admin/customers" },
    { name: "Reports & Analytics", icon: <FileText className="h-5 w-5" />, path: "/admin/reports" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/admin/settings" },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
