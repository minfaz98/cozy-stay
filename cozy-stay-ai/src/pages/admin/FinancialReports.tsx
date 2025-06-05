import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CreditCard, ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reportsAPI } from "@/services/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueByRoomType: {
    type: string;
    revenue: number;
    percentage: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
}

interface OccupancyData {
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  occupancyByRoomType: {
    type: string;
    occupancy: number;
    percentage: number;
  }[];
  occupancyByMonth: {
    month: string;
    occupancy: number;
  }[];
}

const FinancialReports = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<"revenue" | "occupancy">("revenue");
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyData | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth !== 'true') {
      navigate('/admin/login');
      return;
    }
    
    setIsAuthorized(true);
  }, [navigate]);
  
  useEffect(() => {
    if (date) {
      fetchReportData();
    }
  }, [reportType, timeRange, date]);
  
  const getDateRange = (selectedDate: Date, range: "daily" | "weekly" | "monthly") => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    switch (range) {
      case "daily":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "weekly":
        start.setDate(start.getDate() - start.getDay());
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case "monthly":
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      if (!date) {
        throw new Error('No date selected');
      }

      // Ensure we have a valid date
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        throw new Error('Invalid date selected');
      }

      const { start, end } = getDateRange(selectedDate, timeRange);

      if (reportType === "revenue") {
        const response = await reportsAPI.getRevenueReport(start.toISOString(), end.toISOString());
        setRevenueData(response.data);
      } else {
        const response = await reportsAPI.getOccupancyReport(start.toISOString(), end.toISOString());
        setOccupancyData(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching report data:', error);
      toast.error(error.message || error.response?.data?.message || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthorized) {
    return null;
  }
  
  // Mock financial data
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 210500 },
    { name: 'Feb', revenue: 190000 },
    { name: 'Mar', revenue: 230000 },
    { name: 'Apr', revenue: 240500 },
    { name: 'May', revenue: 260000 },
    { name: 'Jun', revenue: 310000 },
    { name: 'Jul', revenue: 350000 },
    { name: 'Aug', revenue: 360000 },
    { name: 'Sep', revenue: 290000 },
    { name: 'Oct', revenue: 240000 },
    { name: 'Nov', revenue: 220000 },
    { name: 'Dec', revenue: 280000 }
  ];
  
  const quarterlyRevenueData = [
    { name: 'Q1', revenue: 630500 },
    { name: 'Q2', revenue: 810500 },
    { name: 'Q3', revenue: 1000000 },
    { name: 'Q4', revenue: 740000 }
  ];
  
  const revenueBySourceData = [
    { name: 'Room Bookings', value: 2180000 },
    { name: 'Food & Beverage', value: 850000 },
    { name: 'Spa & Wellness', value: 320000 },
    { name: 'Events', value: 250000 },
    { name: 'Other', value: 120000 }
  ];
  
  const roomRevenueTrendData = [
    { name: 'Jan', standard: 42000, deluxe: 65000, executive: 75000, luxury: 28500 },
    { name: 'Feb', standard: 38000, deluxe: 60000, executive: 68000, luxury: 24000 },
    { name: 'Mar', standard: 45000, deluxe: 70000, executive: 85000, luxury: 30000 },
    { name: 'Apr', standard: 48000, deluxe: 72000, executive: 88000, luxury: 32500 },
    { name: 'May', standard: 52000, deluxe: 78000, executive: 95000, luxury: 35000 },
    { name: 'Jun', standard: 62000, deluxe: 93000, executive: 115000, luxury: 40000 },
    { name: 'Jul', standard: 70000, deluxe: 105000, executive: 130000, luxury: 45000 },
    { name: 'Aug', standard: 72000, deluxe: 108000, executive: 133000, luxury: 47000 },
    { name: 'Sep', standard: 58000, deluxe: 87000, executive: 107000, luxury: 38000 },
    { name: 'Oct', standard: 48000, deluxe: 72000, executive: 88000, luxury: 32000 },
    { name: 'Nov', standard: 44000, deluxe: 66000, executive: 81000, luxury: 29000 },
    { name: 'Dec', standard: 56000, deluxe: 84000, executive: 103000, luxury: 37000 }
  ];
  
  const recentTransactionsData = [
    { id: 'T-2305-001', date: '2025-05-07', guest: 'Michael Johnson', type: 'Room Booking', amount: 450, paymentMethod: 'Credit Card' },
    { id: 'T-2305-002', date: '2025-05-07', guest: 'Sarah Williams', type: 'Restaurant', amount: 120, paymentMethod: 'Room Charge' },
    { id: 'T-2305-003', date: '2025-05-06', guest: 'Robert Brown', type: 'Spa Service', amount: 180, paymentMethod: 'Credit Card' },
    { id: 'T-2305-004', date: '2025-05-06', guest: 'Jennifer Davis', type: 'Room Booking', amount: 650, paymentMethod: 'Credit Card' },
    { id: 'T-2305-005', date: '2025-05-05', guest: 'David Miller', type: 'Event Booking', amount: 1200, paymentMethod: 'Bank Transfer' },
    { id: 'T-2305-006', date: '2025-05-05', guest: 'Linda Wilson', type: 'Room Booking', amount: 750, paymentMethod: 'Credit Card' },
    { id: 'T-2305-007', date: '2025-05-04', guest: 'James Anderson', type: 'No-Show Charge', amount: 275, paymentMethod: 'Credit Card' },
    { id: 'T-2305-008', date: '2025-05-04', guest: 'Travel Company A', type: 'Group Booking', amount: 3600, paymentMethod: 'Invoice' }
  ];
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  // Calculate totals
  const totalRevenue = monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const averageMonthlyRevenue = totalRevenue / 12;
  const totalRoomRevenue = revenueBySourceData.find(item => item.name === 'Room Bookings')?.value || 0;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Financial Reports</h1>
            <p className="text-gray-500">View detailed financial analytics and reports</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {showCalendar && (
                <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setShowCalendar(false);
                    }}
                    className="p-2"
                  />
                </div>
              )}
            </div>
            <Button className="flex items-center gap-2 bg-hotel hover:bg-hotel-dark">
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card>
            <CardContent className="flex flex-col p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Total Annual Revenue</p>
                <div className="p-2 bg-green-100 rounded-full">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}k</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">Year to date</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Average Monthly Revenue</p>
                <div className="p-2 bg-blue-100 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold">${(averageMonthlyRevenue / 1000).toFixed(0)}k</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">Current year</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Room Revenue</p>
                <div className="p-2 bg-purple-100 rounded-full">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold">${(totalRoomRevenue / 1000).toFixed(0)}k</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">Year to date</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Revenue Trend</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('monthly')}
                    className={selectedPeriod === 'monthly' ? 'bg-hotel hover:bg-hotel-dark' : ''}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={selectedPeriod === 'quarterly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('quarterly')}
                    className={selectedPeriod === 'quarterly' ? 'bg-hotel hover:bg-hotel-dark' : ''}
                  >
                    Quarterly
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedPeriod === 'monthly' ? monthlyRevenueData : quarterlyRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `$${value / 1000}k`} 
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} 
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueBySourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBySourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="room-revenue" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="room-revenue">Room Revenue</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="no-show">No-Show Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="room-revenue">
            <Card>
              <CardHeader>
                <CardTitle>Room Revenue by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={roomRevenueTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `$${value / 1000}k`} 
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="standard" name="Standard Rooms" stroke="#8884d8" />
                      <Line type="monotone" dataKey="deluxe" name="Deluxe Rooms" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="executive" name="Executive Suites" stroke="#ffc658" />
                      <Line type="monotone" dataKey="luxury" name="Luxury Suites" stroke="#ff8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactionsData.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.guest}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="no-show">
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>No-Show Revenue Analysis</CardTitle>
                <div className="text-sm text-gray-500">
                  Data collected at 7:00 PM daily
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">Total No-Show Revenue (YTD)</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-hotel">$138,450</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">Average Monthly</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-hotel">$11,538</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">No-Show Rate</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-hotel">3.7%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-4">Monthly No-Show Revenue</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { month: 'Jan', revenue: 9800 },
                            { month: 'Feb', revenue: 8500 },
                            { month: 'Mar', revenue: 10500 },
                            { month: 'Apr', revenue: 11200 },
                            { month: 'May', revenue: 12400 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                          <Bar dataKey="revenue" name="No-Show Revenue" fill="#ff8042" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-4">No-Show By Room Type</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No-Shows (YTD)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2">Standard Room</td>
                          <td className="px-4 py-2">68</td>
                          <td className="px-4 py-2">$12,240</td>
                          <td className="px-4 py-2">8.8%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Deluxe Room</td>
                          <td className="px-4 py-2">125</td>
                          <td className="px-4 py-2">$31,250</td>
                          <td className="px-4 py-2">22.6%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Executive Suite</td>
                          <td className="px-4 py-2">156</td>
                          <td className="px-4 py-2">$70,200</td>
                          <td className="px-4 py-2">50.7%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Twin Room</td>
                          <td className="px-4 py-2">52</td>
                          <td className="px-4 py-2">$10,920</td>
                          <td className="px-4 py-2">7.9%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Luxury Suite</td>
                          <td className="px-4 py-2">18</td>
                          <td className="px-4 py-2">$13,840</td>
                          <td className="px-4 py-2">10.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FinancialReports;
