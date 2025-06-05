import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CreditCard, Bed, Clock, Building2 } from 'lucide-react';
import { reservationsAPI } from "@/services/api";
import { toast } from "sonner";
import Layout from '@/components/Layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Reservation {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
  room: {
    number: string;
    type: string;
  };
  user: {
    name: string;
    email: string;
  };
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchReservations();
  }, [user, navigate]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsAPI.getUserReservations();
      setReservations(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'CHECKED_IN': return 'bg-blue-100 text-blue-800';
      case 'CHECKED_OUT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const now = new Date();
    const checkIn = new Date(reservation.checkIn);
    
    if (activeTab === "upcoming") {
      return checkIn >= now && reservation.status !== 'CANCELLED';
    } else if (activeTab === "past") {
      return checkIn < now || reservation.status === 'CHECKED_OUT';
    } else if (activeTab === "cancelled") {
      return reservation.status === 'CANCELLED';
    }
    return true;
  });

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsDialogOpen(true);
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    setReservationToCancel(reservation);
    setIsCancelDialogOpen(true);
  };

  const confirmCancellation = async () => {
    if (!reservationToCancel) return;

    try {
      await reservationsAPI.cancelReservation(reservationToCancel.id);
      toast.success('Reservation cancelled successfully');
      fetchReservations(); // Refresh the reservations list
      setIsCancelDialogOpen(false);
      setReservationToCancel(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              className="bg-hotel hover:bg-hotel-dark"
              onClick={() => navigate('/rooms')}
            >
              Book a Room
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex flex-col p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Upcoming Stays</p>
                <div className="p-2 bg-gray-100 rounded-full">
                  <Calendar className="h-6 w-6 text-hotel" />
                </div>
              </div>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">
                  {reservations.filter(r => new Date(r.checkIn) >= new Date() && r.status !== 'CANCELLED').length}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <div className="p-2 bg-gray-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">
                  ${reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Nights Stayed</p>
                <div className="p-2 bg-gray-100 rounded-full">
                  <Bed className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">
                  {reservations.reduce((sum, r) => {
                    const checkIn = new Date(r.checkIn);
                    const checkOut = new Date(r.checkOut);
                    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                    return sum + nights;
                  }, 0)}
                </h3>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'COMPANY' && (
            <Card>
              <CardContent className="flex flex-col p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">Company Bookings</p>
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold">
                    {reservations.length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="text-muted-foreground">
                              No reservations found
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReservations.map(reservation => (
                          <TableRow key={reservation.id}>
                            <TableCell>
                              {reservation.room.number} ({reservation.room.type})
                            </TableCell>
                            <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                            <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                            <TableCell>${reservation.totalAmount}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                                {reservation.status.replace('_', ' ')}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(reservation)}
                                >
                                  View Details
                                </Button>
                                {reservation.status !== 'CANCELLED' && 
                                 reservation.status !== 'CHECKED_OUT' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleCancelReservation(reservation)}
                                  >
                                    Cancel
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Reservation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {reservationToCancel && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Room: {reservationToCancel.room.number} ({reservationToCancel.room.type})</p>
                <p className="text-sm text-gray-500">Check-in: {formatDate(reservationToCancel.checkIn)}</p>
                <p className="text-sm text-gray-500">Check-out: {formatDate(reservationToCancel.checkOut)}</p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCancelDialogOpen(false);
                    setReservationToCancel(null);
                  }}
                >
                  Keep Reservation
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmCancellation}
                >
                  Cancel Reservation
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reservation Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              Details for your reservation
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
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
                        <span className="font-medium">{selectedReservation.room?.number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Type:</span>
                        <span className="font-medium">{selectedReservation.room?.type || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Reservation Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check In:</span>
                        <span className="font-medium">{formatDate(selectedReservation.checkIn)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check Out:</span>
                        <span className="font-medium">{formatDate(selectedReservation.checkOut)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium ${getStatusColor(selectedReservation.status)}`}>
                          {selectedReservation.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount:</span>
                        <span className="font-medium">${selectedReservation.totalAmount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UserDashboard; 