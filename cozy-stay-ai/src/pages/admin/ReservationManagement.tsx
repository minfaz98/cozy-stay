import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Filter, CreditCard, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reservationsAPI, billingAPI, roomsAPI } from "@/services/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'CHECKED_IN' | 'CHECKED_OUT';
  totalAmount: number;
  room: {
    number: string;
    type: string;
  };
  user: {
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  method: string;
  createdAt: string;
}

interface ReservationDetails extends Reservation {
  specialRequests?: string;
  numberOfGuests: number;
  payments: Payment[];
}

interface Invoice {
  id: string;
  bookingId: string;
  totalAmount: number;
  status: string;
  dueDate: string;
  reservationId: string;
  paidAmount?: number;
  remainingAmount?: number;
  room?: {
    id: string;
  };
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, "MMM dd, yyyy");
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const formatDateLong = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, "PPP");
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const ReservationManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedReservationDetails, setSelectedReservationDetails] = useState<ReservationDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const token = localStorage.getItem('token');
    
    if (adminAuth !== 'true' || !token) {
      console.log('Not authenticated:', { adminAuth, token }); // Debug log
      navigate('/admin/login');
      return;
    }
    
    setIsAuthorized(true);
    fetchReservations();
  }, [navigate]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await reservationsAPI.listReservations();
      console.log('API Response:', response); // Debug log
      
      if (!response.data || !response.data.data) {
        console.error('Invalid API response structure:', response);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid response from server"
        });
        return;
      }

      const reservationsData = response.data.data;
      console.log('Reservations data:', reservationsData); // Debug log
      
      setReservations(reservationsData);
    } catch (error: any) {
      console.error('Error fetching reservations:', error); // Debug log
      if (error.response?.status === 401) {
        navigate('/admin/login');
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch reservations"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId: string, newStatus: Reservation['status']) => {
    try {
      await reservationsAPI.updateReservation(reservationId, { status: newStatus });
      const updatedReservations = reservations.map(reservation => 
        reservation.id === reservationId ? {...reservation, status: newStatus} : reservation
      );
      setReservations(updatedReservations);
      setIsStatusDialogOpen(false);
      setSelectedReservation(null);
      toast({
        title: "Success",
        description: "Reservation status updated successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update reservation status"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
      case 'CHECKED_IN': return 'bg-blue-100 text-blue-800';
      case 'CHECKED_OUT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (!reservation || !reservation.room || !reservation.user) return false;
    
    const matchesSearch = 
      reservation.room.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || reservation.status === statusFilter;
    
    const matchesDate = (!dateRange.from || !dateRange.to) || (
      new Date(reservation.checkIn).getTime() >= dateRange.from.getTime() &&
      new Date(reservation.checkOut).getTime() <= dateRange.to.getTime()
    );

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = async (reservationId: string) => {
    try {
      setLoadingDetails(true);
      const response = await reservationsAPI.getReservation(reservationId);
      setSelectedReservationDetails(response.data.data);
      setIsDetailsDialogOpen(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch reservation details"
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCheckout = async (reservationId: string) => {
    try {
      const response = await billingAPI.generateInvoice(reservationId);
      setSelectedInvoice(response.data.data);
      setIsCheckoutDialogOpen(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to generate invoice"
      });
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment amount must be greater than 0"
      });
      return;
    }

    try {
      // Record the payment
      await billingAPI.recordPayment({
        reservationId: selectedInvoice.reservationId,
        amount: amount,
        method: "CREDIT_CARD"
      });

      // Update reservation status to CHECKED_OUT
      await reservationsAPI.updateReservation(selectedInvoice.reservationId, {
        status: 'CHECKED_OUT'
      });

      // Update room status to AVAILABLE
      if (selectedInvoice.room?.id) {
        await roomsAPI.updateRoom(selectedInvoice.room.id, {
          status: 'AVAILABLE'
        });
      }

      toast({
        title: "Success",
        description: "Payment processed and checkout completed successfully"
      });
      
      setIsCheckoutDialogOpen(false);
      setSelectedInvoice(null);
      setPaymentAmount("");
      fetchReservations(); // Refresh the reservations list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to process payment"
      });
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

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reservation Management</h1>
            <p className="text-gray-500">Manage hotel reservations and guest information</p>
          </div>
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by room number, guest name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
                <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range: DateRange | undefined) => setDateRange(range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableCaption>List of all hotel reservations and their current status.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        No reservations found
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map(reservation => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      {reservation.room?.number} {reservation.room?.type && `(${reservation.room.type})`}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reservation.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{reservation.user?.email || 'N/A'}</div>
                        {reservation.user?.role === 'COMPANY' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Company Booking
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                    <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                    <TableCell>${reservation.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)} hover:opacity-80`}
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setIsStatusDialogOpen(true);
                        }}
                      >
                        {reservation.status.replace('_', ' ')}
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(reservation.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(reservation.id)}
                          disabled={loadingDetails}
                        >
                          {loadingDetails ? 'Loading...' : 'View Details'}
                        </Button>
                        {reservation.status === 'CHECKED_IN' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCheckout(reservation.id)}
                            className="bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            Checkout
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Reservation Status</DialogTitle>
            <DialogDescription>
              Update the status for reservation by {selectedReservation?.user?.name || 'Unknown User'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className={`${selectedReservation?.status === 'PENDING' ? 'border-yellow-500' : ''}`}
                onClick={() => selectedReservation && handleStatusChange(selectedReservation.id, 'PENDING')}
              >
                Pending
              </Button>
              <Button
                variant="outline"
                className={`${selectedReservation?.status === 'CONFIRMED' ? 'border-green-500' : ''}`}
                onClick={() => selectedReservation && handleStatusChange(selectedReservation.id, 'CONFIRMED')}
              >
                Confirmed
              </Button>
              <Button
                variant="outline"
                className={`${selectedReservation?.status === 'CANCELLED' ? 'border-red-500' : ''}`}
                onClick={() => selectedReservation && handleStatusChange(selectedReservation.id, 'CANCELLED')}
              >
                Cancelled
              </Button>
              <Button
                variant="outline"
                className={`${selectedReservation?.status === 'NO_SHOW' ? 'border-gray-500' : ''}`}
                onClick={() => selectedReservation && handleStatusChange(selectedReservation.id, 'NO_SHOW')}
              >
                No Show
              </Button>
              <Button
                variant="outline"
                className={`${selectedReservation?.status === 'CHECKED_IN' ? 'border-blue-500' : ''}`}
                onClick={() => selectedReservation && handleStatusChange(selectedReservation.id, 'CHECKED_IN')}
              >
                Checked In
              </Button>
              <Button
                variant="outline"
                className={`${selectedReservation?.status === 'CHECKED_OUT' ? 'border-purple-500' : ''}`}
                onClick={() => selectedReservation && handleStatusChange(selectedReservation.id, 'CHECKED_OUT')}
              >
                Checked Out
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsStatusDialogOpen(false);
              setSelectedReservation(null);
            }}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reservation Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              Reservation for {selectedReservationDetails?.user?.name || 'Unknown User'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservationDetails && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Room Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Number:</span>
                            <span className="font-medium">{selectedReservationDetails.room?.number || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Type:</span>
                            <span className="font-medium">{selectedReservationDetails.room?.type || 'N/A'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Guest Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{selectedReservationDetails.user?.name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{selectedReservationDetails.user?.email || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Number of Guests:</span>
                            <span className="font-medium">{selectedReservationDetails.numberOfGuests || 'N/A'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Reservation Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check In:</span>
                          <span className="font-medium">{formatDateLong(selectedReservationDetails.checkIn)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check Out:</span>
                          <span className="font-medium">{formatDateLong(selectedReservationDetails.checkOut)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium ${getStatusColor(selectedReservationDetails.status)}`}>
                            {selectedReservationDetails.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">${selectedReservationDetails.totalAmount}</span>
                        </div>
                        {selectedReservationDetails.specialRequests && (
                          <div className="mt-4">
                            <span className="text-muted-foreground">Special Requests:</span>
                            <p className="mt-1 text-sm">{selectedReservationDetails.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="billing">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Summary</CardTitle>
                      <CardDescription>
                        Total Amount: ${selectedReservationDetails.totalAmount}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedReservationDetails.payments && selectedReservationDetails.payments.length > 0 ? (
                        <div className="space-y-4">
                          {selectedReservationDetails.payments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">${payment.amount}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payment.method} - {formatDateLong(payment.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payment.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No payment records found
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                      Close
                    </Button>
                    <Button>
                      <Receipt className="mr-2 h-4 w-4" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Checkout</DialogTitle>
            <DialogDescription>
              Generate invoice and process payment for reservation
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedInvoice && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">${selectedInvoice.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paid Amount:</span>
                  <span className="font-medium">${selectedInvoice.paidAmount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Remaining Amount:</span>
                  <span className="font-medium">${selectedInvoice.remainingAmount}</span>
                </div>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount</Label>
                    <Input
                      id="amount"
                      type="text"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                      placeholder="Enter amount"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCheckoutDialogOpen(false);
                        setSelectedInvoice(null);
                        setPaymentAmount("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-hotel hover:bg-hotel-dark"
                    >
                      Process Payment
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ReservationManagement; 