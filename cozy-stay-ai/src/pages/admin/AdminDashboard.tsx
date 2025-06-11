// Description: This file contains the AdminDashboard component which is the main dashboard for the admin panel of the hotel management system. It includes various charts, statistics, and reports related to hotel occupancy, revenue, and bookings.
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { DateRangePicker } from '@/components/ui/date-range-picker';
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
import { useAuth } from "../../context/AuthContext";
import { roomsAPI, reservationsAPI, reportsAPI, billingAPI } from "@/services/api";
import { toast } from "sonner";
import { format } from 'date-fns'; // Import format from date-fns

interface DateRange {
  from: Date | undefined;
 to: Date; // Make 'to' required based on the error message
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

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

interface OccupancyDataPoint {
  name: string;
  occupancy: number;
}

interface RevenueDataPoint {
  name: string;
  amount: number;
}

interface RoomTypeRevenueDataPoint {
  name: string;
  revenue: number;
}


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reportsLoading, setReportsLoading] = useState(false);
  const [roomTypeRevenueData, setRoomTypeRevenueData] = useState<RoomTypeRevenueDataPoint[]>([]);
  const [occupancyReportData, setOccupancyReportData] = useState<any>(null); // Refine type later
  const [financialReportData, setFinancialReportData] = useState<any>(null); // Refine type later
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    occupiedRooms: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [reportDateRange, setReportDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth !== 'true') {
      navigate('/admin/login');
    } else {
      // Set initial report date range to last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      setReportDateRange({ from: thirtyDaysAgo, to: today });
    }
    fetchDashboardData();
  }, [navigate]);

   const fetchDashboardData = async () => {
 setLoading(true);
    try {
      const [roomsResponse, reservationsResponse] = await Promise.all([
        roomsAPI.listRooms(),
 reservationsAPI.listReservations()
      ]);

      const rooms = roomsResponse.data.data;
      const reservations = reservationsResponse.data.data;

      // Calculate stats
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter((room: any) => room.status === "OCCUPIED").length;
      const totalReservations = reservations.length;
      const pendingReservations = reservations.filter((res: any) => res.status === "PENDING").length;
      // totalRevenue and monthlyRevenue will be updated from report data

      setStats((prevStats) => ({
        ...prevStats, // Preserve existing revenue stats if they were fetched by date range
        totalRooms,
        occupiedRooms,
        totalReservations,
        pendingReservations,
      }));

      // Set recent activity (combine recent reservations and room updates)
      const activities = [
        ...reservations.slice(0, 5).map((res: any) => ({
          id: res.id,
          type: "reservation",
          description: `New reservation for Room ${res.room?.number}`,
          timestamp: res.createdAt,
        })).filter((activity: any) => activity.description !== 'New reservation for Room undefined'), // Filter out entries with undefined room number
        ...rooms
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

  const fetchReportData = async () => {
    setOccupancyReportData(null); // Clear previous report data
    setFinancialReportData(null); // Clear previous report data
    setRoomTypeRevenueData([]); // Clear previous room type revenue data

    if (!reportDateRange.from || !reportDateRange.to) {
      toast.info("Please select a date range for reports.");
      return;
    }

    try {
      setReportsLoading(true);
      const [occupancyResponse, financialResponse] = await Promise.all([
        reportsAPI.getOccupancyReport(reportDateRange.from.toISOString(), reportDateRange.to.toISOString()),
        reportsAPI.getFinancialReport(reportDateRange.from.toISOString(), reportDateRange.to.toISOString()),
      ]);

      setOccupancyReportData(occupancyResponse.data.data);
      setFinancialReportData(financialResponse.data.data);

      // Transform revenueByRoomType data for the chart
      const revenueByRoomType = financialResponse.data.data.revenueByRoomType;
      if (revenueByRoomType) {
        const transformedRoomTypeData = Object.entries(revenueByRoomType).map(([roomType, revenue]) => ({
          name: roomType,
          revenue: revenue as number, // Cast to number
        }));
        setRoomTypeRevenueData(transformedRoomTypeData);
      }


      setStats(prevStats => ({
        ...prevStats,
        totalRevenue: financialResponse.data.data.totalRevenue,
        monthlyRevenue: financialResponse.data.data.totalRevenue, // Assuming the range covers a month for this display
      }));

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch report data");
    } finally {
      setReportsLoading(false);
    }
  };

  // Fetch report data when the date range changes
  useEffect(() => {
    if (reportDateRange.from && reportDateRange.to) {
      fetchReportData();
    }
  }, [reportDateRange]); // Added reportDateRange as a dependency


 // Handler for DateRangePicker change
  const handleDateRangeChange = (range: DateRange) => {
    setReportDateRange(range);
  };

  // Authorization check
  if (!user || user.role !== 'MANAGER') { // Assuming the manager role is 'MANAGER'
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Access denied. Only managers can access this page.</p>
      </div>
    );
  }


  if (loading) { // Use single loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Data for charts
  const revenueData: RevenueDataPoint[] = financialReportData?.revenueByDay ? Object.entries(financialReportData.revenueByDay).map(([date, amount]) => ({
    name: format(new Date(date), 'MMM dd'), // Format date for display
    amount: amount as number, // Cast to number
  })) : [];

  const occupancyData: OccupancyDataPoint[] = occupancyReportData?.occupancyByDay ? Object.entries(occupancyReportData.occupancyByDay).map(([date, data]: [string, any]) => ({
    name: format(new Date(date), 'MMM dd'), // Format date for display
    occupancy: data.occupancyRate as number, // Use 'occupancyRate' and cast to number
  })) : [];


  // Data for summary stats
  const summaryStats = useMemo(() => [
    {
      title: "Total Rooms",
      value: stats.totalRooms.toString(),
      icon: <Bed className="h-6 w-6 text-hotel" />,
      description: "Total number of rooms in the hotel"
    },
    {
      title: "Occupied Rooms",
      value: stats.occupiedRooms.toString(),
      icon: <CalendarIcon className="h-6 w-6 text-blue-600" />,
      description: "Currently occupied rooms"
    },
    {
      title: "Occupancy Rate",
      value: `${((stats.occupiedRooms / stats.totalRooms) * 100 || 0).toFixed(1)}%`,
      icon: <Hotel className="h-6 w-6 text-cyan-600" />,
      description: "Current occupancy percentage"
    },
    {
      title: "Total Reservations",
      value: stats.totalReservations.toString(),
      icon: <Users className="h-6 w-6 text-purple-600" />,
      description: "Total number of reservations"
    },
    {
      title: "Pending Reservations",
      value: stats.pendingReservations.toString(),
      // icon: <Clock className="h-6 w-6 text-yellow-600" />, // Assuming Clock icon is available
      description: "Reservations awaiting confirmation"
    },
    {
      title: "Total Revenue (Period)",
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      description: reportDateRange.from && reportDateRange.to ? `Revenue from ${format(reportDateRange.from, 'MMM dd, yyyy')} to ${format(reportDateRange.to, 'MMM dd, yyyy')}` : "Select date range for revenue"
    }
  ], [stats, reportDateRange]);


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
              onClick={fetchReportData} // Call fetchReportData directly
              disabled={reportsLoading || !reportDateRange.from || !reportDateRange.to} // Disable button while reports are loading or dates are not selected
            >
              <ChartIcon className="h-4 w-4 mr-2" /> {/* Added mr-2 for spacing */}
              Generate Reports
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
            <CardContent className="flex flex-col">
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
                    <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
                    <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="amount" name="Revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {financialReportData && ( // Conditionally render if financialReportData exists
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Overall Revenue Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p>Total Revenue: <span className="font-medium">${financialReportData.totalRevenue?.toFixed(2) || '0.00'}</span></p></div>
                    <div><p>Room Revenue: <span className="font-medium">${financialReportData.roomRevenue?.toFixed(2) || '0.00'}</span></p></div>
                    <div><p>Optional Charges Revenue: <span className="font-medium">${financialReportData.optionalChargesRevenue?.toFixed(2) || '0.00'}</span></p></div>
                    {/* Add more financial metrics as needed */}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Reports Date Range</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2" >
               <DateRangePicker
                value={reportDateRange}
                onChange={handleDateRangeChange} // Use the handler function
                />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                 mode="single"
                 selected={new Date()} // Using a placeholder for now
                 className="border rounded-md"
                disabled={{
                  before: new Date(),
                }}
              />
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Upcoming Events</h4>
                <ul className="space-y-2">
                  {/* Placeholder items - replace with actual data */}
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
            <CardContent className="flex flex-col" >
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
                    <YAxis tickFormatter={(value) => `${value}%`} /> {/* Assuming percentage for occupancy */}
                    <Tooltip formatter={(value: any) => `${value?.toFixed(1)}%`} /> {/* Use optional chaining */}
                    <Legend />
                    <Line type="monotone" dataKey="occupancy" name="Occupancy Rate" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {occupancyReportData && ( // Conditionally render if occupancyReportData exists
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Occupancy Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p>Total Occupied Rooms: <span className="font-medium">{occupancyReportData.occupiedRooms || 0}</span></p></div>
                    <div><p>Total Rooms: <span className="font-medium">{occupancyReportData.totalRooms || 0}</span></p></div> {/* Corrected to totalRooms */}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Type Revenue</CardTitle> {/* Changed title to reflect data */}
            </CardHeader>
            <CardContent >
              <div className="h-80" >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roomTypeRevenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value?.toFixed(2) || '0.00'}`} /> {/* Use optional chaining and default */}
                    <Tooltip formatter={(value: any) => `$${value?.toFixed(2) || '0.00'}`} /> {/* Use optional chaining and default */}
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
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
                        <h4 className="font-semibold text-gray-700">Current Occupancy Rate</h4> {/* Changed title */}
                        <div className="mt-2 flex items-baseline">
                          {/* Display current occupancy rate from stats */}
                          <span className="text-3xl font-bold text-hotel">
                            {((stats.occupiedRooms / stats.totalRooms) * 100 || 0).toFixed(1)}%
                          </span>
                          {/* Placeholder for comparison */}
                          <span className="ml-2 text-sm text-green-600">+5% from last week</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Average Occupancy (Period)</h4> {/* Changed title */}
                        <div className="mt-2 flex items-baseline">
                          {/* Display average occupancy from occupancyReportData */}
                          <span className="text-3xl font-bold text-hotel">
                             {(occupancyReportData?.averageOccupancy || 0).toFixed(1)}%
                          </span>
                          {/* Placeholder for comparison */}
                          <span className="ml-2 text-sm text-green-600">vs. previous period</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Peak Occupancy (Period)</h4> {/* Changed title */}
                        <div className="mt-2 flex items-baseline">
                          {/* Display peak occupancy from occupancyReportData */}
                          <span className="text-3xl font-bold text-hotel">
                            {(occupancyReportData?.peakOccupancy || 0).toFixed(1)}%
                          </span>
                           {/* Placeholder for comparison */}
                          <span className="ml-2 text-sm text-green-600">Highest in period</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Occupancy by Day (Period)</h4> {/* Changed title */}
                      {/* Display occupancy data by day in a table or list if needed */}
                       {/* For now, the chart above shows this */}
                       <p className="text-gray-600">Refer to the "Occupancy Trend" chart above for daily occupancy data.</p>

                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="revenue" className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Total Revenue (Period)</h4> {/* Changed title */}
                        <div className="mt-2 flex items-baseline">
                          {/* Display total revenue from financialReportData */}
                          <span className="text-3xl font-bold text-hotel">${(financialReportData?.totalRevenue || 0).toLocaleString()}</span>
                           {/* Placeholder for comparison */}
                          <span className="ml-2 text-sm text-green-600">+12% from last period</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Room Revenue (Period)</h4> {/* Changed title */}
                        <div className="mt-2 flex items-baseline">
                          {/* Display room revenue from financialReportData */}
                          <span className="text-3xl font-bold text-hotel">${(financialReportData?.roomRevenue || 0).toLocaleString()}</span>
                           {/* Placeholder for comparison */}
                          <span className="ml-2 text-sm text-green-600">76% of total</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700">Optional Charges Revenue (Period)</h4> {/* Changed title */}
                        <div className="mt-2 flex items-baseline">
                          {/* Display optional charges revenue from financialReportData */}
                          <span className="text-3xl font-bold text-hotel">${(financialReportData?.optionalChargesRevenue || 0).toLocaleString()}</span>
                           {/* Placeholder for comparison */}
                          <span className="ml-2 text-sm text-green-600">24% of total</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Revenue Breakdown by Source (Period)</h4> {/* Changed title */}
                       {/* Display revenue data by source (e.g., room types, optional charges) */}
                       {financialReportData?.revenueByRoomType && (
                        <div>
                          <h5 className="font-semibold text-gray-600 mb-2">By Room Type:</h5>
                          <table className="min-w-full divide-y divide-gray-200 mb-4">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Object.entries(financialReportData.revenueByRoomType).map(([roomType, revenue], index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2">{roomType}</td>
                                  <td className="px-4 py-2">${(revenue as number || 0).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                       )}
                        {financialReportData && (
                         <div>
                           <h5 className="font-semibold text-gray-600 mb-2">By Other Charges:</h5>
                           <p className="text-gray-600">Optional Charges Revenue: ${(financialReportData.optionalChargesRevenue || 0).toFixed(2)}</p>
                           {/* Add other breakdowns if available in financialReportData */}
                         </div>
                        )}

                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="projections" className="p-4">
                  <div className="space-y-4">
                    {/* Placeholder content for projections */}
                    <p className="text-gray-600">Projections report coming soon.</p>
                    {/* You can add charts or data display for projections here when the backend is implemented */}
                  </div>
                </TabsContent>

                <TabsContent value="no-shows" className="p-4">
                  <div className="space-y-4">
                     {/* Placeholder content for no-shows */}
                     <p className="text-gray-600">No-shows report coming soon.</p>
                    {/* You can add charts or data display for no-shows here when the backend is implemented */}
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
                    {((stats.occupiedRooms / stats.totalRooms) * 100 || 0).toFixed(1)}%
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
                    {(((stats.totalReservations - stats.pendingReservations) / stats.totalReservations) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Stats</CardTitle> {/* Changed title */}
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
                {/* Average Daily Revenue might be better calculated based on the selected report date range */}
                 {financialReportData?.averageDailyRevenue && (
                   <div className="flex justify-between">
                     <span>Average Daily Revenue (Period)</span> {/* Changed label */}
                     <span className="font-semibold">${(financialReportData.averageDailyRevenue || 0).toLocaleString()}</span>
                   </div>
                 )}
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
