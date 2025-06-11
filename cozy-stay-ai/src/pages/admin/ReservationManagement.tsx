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
import { Calendar as CalendarIcon, Search, Filter, CreditCard, Receipt, PlusCircle, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reservationsAPI, billingAPI, roomsAPI } from "@/services/api";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authAPI } from '@/services/api';

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
  const [isWalkInDialogOpen, setIsWalkInDialogOpen] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    name: '',
    email: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [walkInLoading, setWalkInLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isEditCheckoutOpen, setIsEditCheckoutOpen] = useState(false);
  const [newCheckoutDate, setNewCheckoutDate] = useState<string | null>(null);

  const [isAddOptionalChargeOpen, setIsAddOptionalChargeOpen] = useState(false);
  const [optionalChargeForm, setOptionalChargeForm] = useState({
    description: '',
    amount: '',
    reservationId: '',
  });

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

  useEffect(() => {
    // Fetch all rooms for walk-in dialog and potentially for room type filtering later
    roomsAPI.listRooms().then(res => setRooms(res.data.data || []));
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

  const handleAddOptionalCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionalChargeForm.reservationId || !optionalChargeForm.description || !optionalChargeForm.amount) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields.' });
      return;
    }
    try {
      const amount = parseFloat(optionalChargeForm.amount);
      if (isNaN(amount) || amount <= 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a valid amount.' });
        return;
      }

      // Corrected the function call to use billingAPI.addOptionalCharge with the correct arguments
      await billingAPI.addOptionalCharge({
        reservationId: optionalChargeForm.reservationId,
        description: optionalChargeForm.description,
        amount: amount,
      });

      toast({ title: 'Optional charge added', description: 'Optional charge added successfully.' });
      setIsAddOptionalChargeOpen(false);
      setOptionalChargeForm({ description: '', amount: '', reservationId: '' });
      // Optionally, re-fetch reservation details to show updated charges
      if (selectedReservationDetails?.id === optionalChargeForm.reservationId) {
        handleViewDetails(selectedReservationDetails.id);
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to add optional charge.' });
    }
  };



  const handleWalkInChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setWalkInForm({ ...walkInForm, [e.target.name]: e.target.value });
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInLoading(true);
    try {
      // 1. Register user if not exists
      let userId = null;
      try {
        const userRes = await authAPI.register({
          email: walkInForm.email,
          password: 'Temp1234!',
          name: walkInForm.name,
          role: 'CUSTOMER',
        });
        userId = userRes.data.data.user.id;
      } catch (err: any) {
        if (err.response?.data?.message === 'Email already registered') {
          // Fetch user id (not ideal, but for demo)
          // In real app, backend should provide a lookup
          userId = null; // Let backend assign by email
        } else {
          throw err;
        }
      }
      // 2. Create reservation with status CHECKED_IN
      await reservationsAPI.createReservation({
        roomId: walkInForm.roomId,
        checkIn: walkInForm.checkIn,
        checkOut: walkInForm.checkOut,
        guests: walkInForm.guests,
        status: 'CHECKED_IN',
        userId: userId,
      });
      toast({ title: 'Walk-in checked in', description: 'Walk-in guest checked in successfully.' });
      setIsWalkInDialogOpen(false);
      setWalkInForm({ name: '', email: '', roomId: '', checkIn: '', checkOut: '', guests: 1 });
      fetchReservations();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to check in walk-in guest.' });
    } finally {
      setWalkInLoading(false);
    }
  };

  const handleEditCheckout = async () => {
    if (!selectedReservationDetails || !newCheckoutDate) return;
    try {
      await reservationsAPI.updateReservation(selectedReservationDetails.id, { checkOut: newCheckoutDate });
      toast({ title: 'Checkout date updated', description: 'The checkout date has been updated.' });
      setIsEditCheckoutOpen(false);
      setNewCheckoutDate(null);
      fetchReservations();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to update checkout date.' });
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
          <Button onClick={() => setIsWalkInDialogOpen(true)} className="flex items-center gap-2 bg-hotel hover:bg-hotel-dark">
            <PlusCircle className="h-5 w-5" /> Walk-in Check-in
          </Button>
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
                        {reservation.status === 'CHECKED_IN' && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => { setSelectedReservationDetails(reservation as any); setIsAddOptionalChargeOpen(true); setOptionalChargeForm({...optionalChargeForm, reservationId: reservation.id})}}
                         >
                           <PlusCircle className="h-4 w-4 mr-1" /> Add Charge
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

      {/* Walk-in Check-in Dialog */}
      <Dialog open={isWalkInDialogOpen} onOpenChange={setIsWalkInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Walk-in Check-in</DialogTitle>
            <DialogDescription>Enter guest and room details for walk-in check-in.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWalkInSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="name" value={walkInForm.name} onChange={handleWalkInChange} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" value={walkInForm.email} onChange={handleWalkInChange} required />
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <select name="roomId" value={walkInForm.roomId} onChange={handleWalkInChange} required className="w-full border rounded px-2 py-1">
                <option value="">Select Room</option>
                {rooms.filter(r => r.is_available).map(room => (
                  <option key={room.id} value={room.id}>{room.number} ({room.type})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Input name="checkIn" type="date" value={walkInForm.checkIn} onChange={handleWalkInChange} required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Input name="checkOut" type="date" value={walkInForm.checkOut} onChange={handleWalkInChange} required min={walkInForm.checkIn || new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label>Number of Guests</Label>
              <Input name="guests" type="number" min={1} value={walkInForm.guests} onChange={handleWalkInChange} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsWalkInDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-hotel hover:bg-hotel-dark" disabled={walkInLoading}>{walkInLoading ? 'Checking in...' : 'Check In'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Checkout Date Dialog */}
      <Dialog open={isEditCheckoutOpen} onOpenChange={setIsEditCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Checkout Date</DialogTitle>
            <DialogDescription>Update the checkout date for this reservation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>New Checkout Date</Label>
            <Input type="date" value={newCheckoutDate || ''} onChange={e => setNewCheckoutDate(e.target.value)} min={selectedReservationDetails?.checkIn?.split('T')[0]} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCheckoutOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCheckout} className="bg-hotel hover:bg-hotel-dark">Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Optional Charge Dialog */}
      <Dialog open={isAddOptionalChargeOpen} onOpenChange={setIsAddOptionalChargeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Optional Charge</DialogTitle>
            <DialogDescription>Add an additional charge to this reservation.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddOptionalCharge} className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input name="description" value={optionalChargeForm.description} onChange={(e) => setOptionalChargeForm({...optionalChargeForm, description: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input name="amount" type="number" step="0.01" value={optionalChargeForm.amount} onChange={(e) => setOptionalChargeForm({...optionalChargeForm, amount: e.target.value})} required />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddOptionalChargeOpen(false);
                  setOptionalChargeForm({ description: '', amount: '', reservationId: '' });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-hotel hover:bg-hotel-dark">Add Charge</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ReservationManagement;