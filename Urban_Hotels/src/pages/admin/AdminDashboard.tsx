// Description: This file contains the AdminDashboard component which is the main dashboard for the admin panel of the hotel management system. It includes various charts, statistics, and reports related to hotel occupancy, revenue, and bookings.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Hotel,
  Users,
  CreditCard,
  Calendar as CalendarIcon,
  BarChart as ChartIcon,
  Bed,
} from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { roomsAPI, reservationsAPI, reportsAPI } from "@/services/api";
import { toast } from "sonner";

interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  totalReservations: number;
  pendingReservations: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    occupiedRooms: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth !== 'true') {
      navigate('/admin/login');
      return;
    }
    
    setIsAuthorized(true);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [rooms, reservations, revenueReport] = await Promise.all([
        roomsAPI.listRooms(),
        reservationsAPI.listReservations(),
        reportsAPI.getRevenueReport(new Date().toISOString(), new Date().toISOString()),
      ]);

      // Calculate stats
      const totalRooms = rooms.data.data.length;
      const occupiedRooms = rooms.data.data.filter((room: any) => room.status === "OCCUPIED").length;
      const totalReservations = reservations.data.data.length;
      const pendingReservations = reservations.data.data.filter((res: any) => res.status === "PENDING").length;
      const totalRevenue = revenueReport.data.datatotalRevenue;
      const monthlyRevenue = revenueReport.data.data.monthlyRevenue;

      setStats({
        totalRooms,
        occupiedRooms,
        totalReservations,
        pendingReservations,
        totalRevenue,
        monthlyRevenue,
      });

      // Set recent activity (combine recent reservations and room updates)
      const activities = [
        ...reservations.data.slice(0, 5).map((res: any) => ({
          id: res.id,
          type: "reservation",
          description: `New reservation for Room ${res.roomNumber}`,
          timestamp: res.createdAt,
        })),
        ...rooms.data
          .filter((room: any) => room.updatedAt)
          .slice(0, 5)
          .map((room: any) => ({
            id: room.id,
            type: "room",
            description: `Room ${room.number} status updated to ${room.status}`,
            timestamp: room.updatedAt,
          })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRecentActivity(activities);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Mock data for charts and reports
  const occupancyData = [
    { name: 'Jan', current: 65, previous: 55 },
    { name: 'Feb', current: 72, previous: 67 },
    { name: 'Mar', current: 78, previous: 70 },
    { name: 'Apr', current: 75, previous: 71 },
    { name: 'May', current: 82, previous: 74 },
    { name: 'Jun', current: 90, previous: 85 },
    { name: 'Jul', current: 95, previous: 90 },
    { name: 'Aug', current: 93, previous: 88 },
    { name: 'Sep', current: 85, previous: 82 },
    { name: 'Oct', current: 80, previous: 75 },
    { name: 'Nov', current: 70, previous: 65 },
    { name: 'Dec', current: 85, previous: 78 },
  ];

  const revenueData = [
    { name: 'Jan', rooms: 65000, restaurant: 32000, spa: 12000, additional: 8000 },
    { name: 'Feb', rooms: 72000, restaurant: 35000, spa: 13500, additional: 9000 },
    { name: 'Mar', rooms: 78000, restaurant: 38000, spa: 14000, additional: 9500 },
    { name: 'Apr', rooms: 75000, restaurant: 36500, spa: 13000, additional: 8500 },
    { name: 'May', rooms: 82000, restaurant: 40000, spa: 15000, additional: 10000 },
    { name: 'Jun', rooms: 90000, restaurant: 45000, spa: 17000, additional: 12000 },
    { name: 'Jul', rooms: 95000, restaurant: 48000, spa: 18000, additional: 13000 },
    { name: 'Aug', rooms: 93000, restaurant: 47000, spa: 17500, additional: 12500 },
    { name: 'Sep', rooms: 85000, restaurant: 42000, spa: 16000, additional: 11000 },
    { name: 'Oct', rooms: 80000, restaurant: 39000, spa: 15000, additional: 10000 },
    { name: 'Nov', rooms: 70000, restaurant: 34000, spa: 13000, additional: 8000 },
    { name: 'Dec', rooms: 85000, restaurant: 43000, spa: 16000, additional: 11000 },
  ];

  const roomTypeData = [
    { name: 'Standard', occupied: 45, available: 15 },
    { name: 'Deluxe', occupied: 38, available: 12 },
    { name: 'Executive', occupied: 25, available: 5 },
    { name: 'Twin', occupied: 30, available: 10 },
    { name: 'Suite', occupied: 18, available: 7 },
  ];

  const summaryStats = [
    {
      title: "Current Occupancy",
      value: "87%",
      icon: <Bed className="h-6 w-6 text-hotel" />,
      description: "Current occupancy rate"
    },
    {
      title: "Today's Revenue",
      value: "$28,450",
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      description: "Total revenue for today"
    },
    {
      title: "Active Bookings",
      value: "156",
      icon: <CalendarIcon className="h-6 w-6 text-blue-600" />,
      description: "Bookings for next 30 days"
    },
    {
      title: "Today's Check-ins",
      value: "32",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      description: "Guests checking in today"
    }
  ];
 
  return (
    <AdminLayout>
      <div className="grid gap-4 md:gap-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin/reports')}
            >
              <ChartIcon className="h-4 w-4" />
              View Full Reports
            </Button>
            <Button className="flex items-center gap-2 bg-hotel hover:bg-hotel-dark">
              Export Data
            </Button>
          </div>
        </div>
         
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {summaryStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="p-2 bg-gray-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rooms" stackId="a" name="Room Revenue" fill="#8884d8" />
                    <Bar dataKey="restaurant" stackId="a" name="Restaurant" fill="#82ca9d" />
                    <Bar dataKey="spa" stackId="a" name="Spa Services" fill="#ffc658" />
                    <Bar dataKey="additional" stackId="a" name="Additional Services" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md"
                disabled={{
                  before: new Date(),
                }}
              />
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Events for {date?.toLocaleDateString()}</h4>
                <ul className="space-y-2">
                  <li className="text-sm p-2 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <span className="font-medium">12 check-ins</span><br />
                    <span className="text-gray-600">Expected arrival: 3:00 PM - 8:00 PM</span>
                  </li>
                  <li className="text-sm p-2 bg-green-50 border-l-4 border-green-500 rounded">
                    <span className="font-medium">8 check-outs</span><br />
                    <span className="text-gray-600">Standard checkout: by 12:00 PM</span>
                  </li>
                  <li className="text-sm p-2 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <span className="font-medium">Corporate event</span><br />
                    <span className="text-gray-600">Grand Ballroom: 6:00 PM - 10:00 PM</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={occupancyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      name="Current Year" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previous" 
                      name="Previous Year" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Type Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roomTypeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="occupied" name="Occupied" fill="#8884d8" />
                    <Bar dataKey="available" name="Available" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="occupancy">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="projections">Projections</TabsTrigger>
                  <TabsTrigger value="no-shows">No-Shows</TabsTrigger>
                </TabsList>
                
                <TabsContent value="occupancy" className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Current Occupancy</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">87%</span>
                          <span className="ml-2 text-sm text-green-600">+5% from last week</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Average Daily Rate</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">$245</span>
                          <span className="ml-2 text-sm text-green-600">+$12 from last month</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">RevPAR</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">$213.15</span>
                          <span className="ml-2 text-sm text-green-600">+8% YoY</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Room Type Distribution</h4>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {roomTypeData.map((room, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap">{room.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{room.occupied}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{room.available}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                ${Math.floor(180 + Math.random() * 150)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="revenue" className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Total Monthly Revenue</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">$985,450</span>
                          <span className="ml-2 text-sm text-green-600">+12% from last month</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Room Revenue</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">$745,200</span>
                          <span className="ml-2 text-sm text-green-600">76% of total</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Additional Services</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">$240,250</span>
                          <span className="ml-2 text-sm text-green-600">24% of total</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Revenue Breakdown by Source</h4>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2">Room Bookings</td>
                            <td className="px-4 py-2">$745,200</td>
                            <td className="px-4 py-2">76%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Restaurant & Room Service</td>
                            <td className="px-4 py-2">$125,350</td>
                            <td className="px-4 py-2">13%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Spa & Wellness</td>
                            <td className="px-4 py-2">$58,450</td>
                            <td className="px-4 py-2">6%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Events & Conferences</td>
                            <td className="px-4 py-2">$45,200</td>
                            <td className="px-4 py-2">4%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">Other Services</td>
                            <td className="px-4 py-2">$11,250</td>
                            <td className="px-4 py-2">1%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="projections" className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Projected Occupancy (Next 30 Days)</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">92%</span>
                          <span className="ml-2 text-sm text-green-600">High Season</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Projected Revenue (Next 30 Days)</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">$1.2M</span>
                          <span className="ml-2 text-sm text-green-600">+15% YoY</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Reservation Pace</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">+8%</span>
                          <span className="ml-2 text-sm text-green-600">vs. same time last year</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Forward-Looking Booking Pace</h4>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Occupancy</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">vs. Last Year</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected ADR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2">Next 7 Days</td>
                            <td className="px-4 py-2">95%</td>
                            <td className="px-4 py-2">+3%</td>
                            <td className="px-4 py-2">$255</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">8-30 Days</td>
                            <td className="px-4 py-2">89%</td>
                            <td className="px-4 py-2">+7%</td>
                            <td className="px-4 py-2">$245</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">31-60 Days</td>
                            <td className="px-4 py-2">76%</td>
                            <td className="px-4 py-2">+12%</td>
                            <td className="px-4 py-2">$235</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">61-90 Days</td>
                            <td className="px-4 py-2">65%</td>
                            <td className="px-4 py-2">+9%</td>
                            <td className="px-4 py-2">$225</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="no-shows" className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">No-Show Rate (MTD)</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">3.8%</span>
                          <span className="ml-2 text-sm text-green-600">-0.5% from last month</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Total No-Show Revenue</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">$24,650</span>
                          <span className="ml-2 text-sm text-gray-500">May 2025</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Auto-Cancellations</h4>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold text-hotel">48</span>
                          <span className="ml-2 text-sm text-gray-500">Last 30 days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Recent No-Show Billing Report</h4>
                      <p className="text-sm text-gray-500 mb-4">Generated daily at 7:00 PM</p>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billed Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2">May 06, 2025</td>
                            <td className="px-4 py-2">John Smith</td>
                            <td className="px-4 py-2">Deluxe Room</td>
                            <td className="px-4 py-2">$275.00</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Charged</span></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">May 06, 2025</td>
                            <td className="px-4 py-2">Maria Rodriguez</td>
                            <td className="px-4 py-2">Executive Suite</td>
                            <td className="px-4 py-2">$420.00</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Charged</span></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">May 05, 2025</td>
                            <td className="px-4 py-2">Robert Johnson</td>
                            <td className="px-4 py-2">Standard Room</td>
                            <td className="px-4 py-2">$195.00</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">May 05, 2025</td>
                            <td className="px-4 py-2">Jennifer Lee</td>
                            <td className="px-4 py-2">Twin Room</td>
                            <td className="px-4 py-2">$220.00</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Charged</span></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">May 04, 2025</td>
                            <td className="px-4 py-2">Michael Brown</td>
                            <td className="px-4 py-2">Luxury Suite</td>
                            <td className="px-4 py-2">$550.00</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rooms Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Rooms</span>
                  <span className="font-semibold">{stats.totalRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupied Rooms</span>
                  <span className="font-semibold">{stats.occupiedRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy Rate</span>
                  <span className="font-semibold">
                    {((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Reservations</span>
                  <span className="font-semibold">{stats.totalReservations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Reservations</span>
                  <span className="font-semibold">{stats.pendingReservations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span className="font-semibold">
                    {(((stats.totalReservations - stats.pendingReservations) / stats.totalReservations) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Revenue</span>
                  <span className="font-semibold">${(stats.totalRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Revenue</span>
                  <span className="font-semibold">${(stats.monthlyRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Daily Revenue</span>
                  <span className="font-semibold">
                    ${((stats.monthlyRevenue || 0) / 30).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activity.type === "reservation"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
