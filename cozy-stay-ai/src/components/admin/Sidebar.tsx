import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    name: 'Rooms',
    path: '/admin/room-management',
    icon: <Hotel className="h-5 w-5" />
  },
  {
    name: 'Reservations',
    path: '/admin/reservations',
    icon: <Calendar className="h-5 w-5" />
  },
  {
    name: 'Financial',
    path: '/admin/financial',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    logout();
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <Hotel className="h-8 w-8 text-hotel-accent" />
          <span className="text-xl font-bold">CozyStay</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors",
                location.pathname === item.path && "bg-gray-800 text-white"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 