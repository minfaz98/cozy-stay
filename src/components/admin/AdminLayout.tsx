
import React, { useState } from 'react';
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

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-gray-900 text-white transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <Link 
            to="/admin/dashboard" 
            className={cn(
              "flex items-center gap-3", 
              !isSidebarOpen && "justify-center"
            )}
          >
            <Hotel className="h-8 w-8 text-hotel-accent" />
            {isSidebarOpen && (
              <span className="text-xl font-bold">CozyStay</span>
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <ChevronDown 
              className={cn(
                "h-5 w-5 transform transition-transform",
                !isSidebarOpen && "rotate-90"
              )} 
            />
          </button>
        </div>
        
        <nav className="mt-8">
          <div className="space-y-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors",
                  location.pathname === item.path && "bg-gray-800 text-white",
                  !isSidebarOpen && "justify-center px-2"
                )}
              >
                {item.icon}
                {isSidebarOpen && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center text-gray-700">
                    A
                  </div>
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <Link 
                      to="/admin/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  View Website
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
