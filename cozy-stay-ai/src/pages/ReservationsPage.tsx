import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, AlertCircle, FileText, CreditCard } from 'lucide-react';
import RoomFeature from '@/components/RoomFeature';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { useReservations } from '@/hooks/useReservations';
import { Reservation, NoShowReport } from '@/types/reservation';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// Mock no-show reports data (in a real app, this would come from an API)
const mockNoShowReports: NoShowReport[] = [
  {
    id: 'rep-001',
    date: '2025-04-28',
    totalReservations: 3,
    noShowCount: 1,
    revenue: '$350.00',
  },
  {
    id: 'rep-002',
    date: '2025-04-29',
    totalReservations: 5,
    noShowCount: 2,
    revenue: '$750.00',
  }
];

const ReservationsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [showCancellationAlert, setShowCancellationAlert] = useState(false);
  const [reservationToBill, setReservationToBill] = useState<Reservation | null>(null);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAutoCancelInfo, setShowAutoCancelInfo] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  
  const {
    reservations,
    isLoading: reservationsLoading,
    isError,
    error,
    refetch,
    cancelReservation,
    markAsNoShow
  } = useReservations();
  
  // Update the current time every minute to check for auto-cancellations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkForAutoCancellations();
    }, 60000); // Every minute
    
    return () => clearInterval(timer);
  }, [reservations]);
  
  // Check for unpaid reservations that should be auto-cancelled
  const checkForAutoCancellations = () => {
    if (!reservations) return;
    
    const now = new Date();
    const isPM7 = now.getHours() === 19 && now.getMinutes() === 0;
    
    // For demo purposes, we're checking if there are any unpaid reservations
    if (!showAutoCancelInfo) {
      const unpaidReservations = reservations.filter(res => 
        res.payment_status === 'unpaid' && res.status === 'confirmed'
      );
      
      if (unpaidReservations.length > 0) {
        setShowAutoCancelInfo(true);
      }
    }
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login', { state: { from: '/reservations' } });
  };
  
  const handleFindReservation = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search for the reservation
    toast({
      title: "Reservation Found",
      description: `Found reservation with confirmation number: ${confirmationNumber}`,
      duration: 3000,
    });

    refetch();
  };

  // Function to handle auto-cancellation of unpaid bookings
  const handleAutoCancellation = () => {
    if (!reservations) return;
    
    // Cancel all unpaid reservations
    const unpaidReservations = reservations.filter(res => 
      res.payment_status === 'unpaid' && res.status === 'confirmed'
    );
    
    unpaidReservations.forEach(reservation => {
      cancelReservation({ 
        id: reservation.id, 
        reason: 'Auto-cancelled (unpaid at 7PM)' 
      });
    });
    
    setShowAutoCancelInfo(false);
    
    toast({
      title: "Auto-cancellation complete",
      description: "Unpaid reservations have been automatically cancelled.",
      duration: 5000,
    });
  };
  
  // Function to process no-show billing
  const handleNoShowBilling = () => {
    if (!reservationToBill) return;
    
    markAsNoShow(reservationToBill.id);
    setShowBillingDialog(false);
  };
  
  // Function to generate no-show report
  const generateNoShowReport = () => {
    // In a real app, this would generate a proper report
    setShowReportDialog(true);
  };

  // Function to view reservation details
  const handleViewDetails = (reservation: Reservation) => {
    toast({
      title: "Viewing Reservation",
      description: `Details for ${reservation.id} - ${reservation.roomType}`,
      duration: 3000,
    });
  };

  // Function to modify reservation
  const handleModifyReservation = (reservation: Reservation) => {
    toast({
      title: "Modify Reservation",
      description: `You can now edit ${reservation.id} - ${reservation.roomType}`,
      duration: 3000,
    });
  };

  // Function to cancel reservation
  const handleCancelReservation = (reservation: Reservation) => {
    setReservationToCancel(reservation);
    setShowCancellationDialog(true);
  };
  
  // Function to confirm cancellation
  const confirmCancellation = () => {
    if (!reservationToCancel) return;
    
    cancelReservation({ 
      id: reservationToCancel.id, 
      reason: cancellationReason || 'Customer requested cancellation' 
    });
    
    setShowCancellationDialog(false);
    setCancellationReason('');
    setReservationToCancel(null);
  };

  // Function to navigate to make a new reservation
  const handleMakeReservation = () => {
    navigate('/check-availability');
  };

  // Function to redirect to contact page
  const handleContactUs = () => {
    navigate('/contact');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Layout>
      <div className="bg-hotel-bg py-12">
        <div className="hotel-container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">Manage Your Reservations</h1>
          
          {authLoading ? (
            <div className="max-w-2xl mx-auto">
              <Skeleton className="h-12 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : !user ? (
            <Tabs defaultValue="login" className="max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Account Login</TabsTrigger>
                <TabsTrigger value="find">Find Reservation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Login to Your Account</CardTitle>
                    <CardDescription>
                      Access your reservations by logging into your CozyStay account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin}>
                      <Button type="submit" className="w-full mt-6 bg-hotel hover:bg-hotel-light">
                        Go to Login
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-center text-muted-foreground">
                      Don't have an account? <a href="/register" className="text-hotel hover:underline">Register now</a>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="find" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Find Your Reservation</CardTitle>
                    <CardDescription>
                      Look up your reservation using your email and confirmation number
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleFindReservation}>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="lookup-email" 
                            type="email" 
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmation">Confirmation Number</Label>
                          <Input 
                            id="confirmation" 
                            placeholder="e.g. RES-1234"
                            value={confirmationNumber}
                            onChange={(e) => setConfirmationNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full mt-6 bg-hotel hover:bg-hotel-light">
                        Find Reservation
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-medium">Your Reservations</h2>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => generateNoShowReport()}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    No-Show Reports
                  </Button>
                </div>
              </div>
              
              {/* Auto-cancellation notice for unpaid bookings */}
              {showAutoCancelInfo && (
                <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Unpaid Reservations Auto-Cancellation Notice</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        One or more confirmed reservations are unpaid and will be automatically cancelled at 7:00 PM today.
                        Please complete payment to avoid cancellation.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white"
                          onClick={() => setShowAutoCancelInfo(false)}
                        >
                          Dismiss
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleAutoCancellation()}
                        >
                          Process Auto-Cancellation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {reservationsLoading ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-1/3" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-28 mr-2" />
                        <Skeleton className="h-10 w-28 mr-2" />
                        <Skeleton className="h-10 w-36" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : isError ? (
                <Card className="text-center p-8">
                  <h3 className="text-xl font-medium mb-2 text-red-600">Error Loading Reservations</h3>
                  <p className="text-muted-foreground mb-6">
                    {error instanceof Error ? error.message : "An unexpected error occurred"}
                  </p>
                  <Button onClick={() => refetch()}>Retry</Button>
                </Card>
              ) : reservations && reservations.length > 0 ? (
                <div className="space-y-6">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <CardTitle>{reservation.room.type} Room</CardTitle>
                            <CardDescription>Room {reservation.room.number} - Confirmation: {reservation.id.substring(0, 8)}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center space-x-2 mb-4">
                              <div className={`px-2 py-1 rounded-full text-sm ${
 reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                reservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                reservation.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                reservation.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-800' :
                                reservation.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {reservation.status}
                              </div>
                              {reservation.status === 'PENDING' && (
                                <div className="text-sm text-yellow-600">
                                  <AlertCircle className="h-4 w-4 inline mr-1" />
                                  Will be cancelled at 7 PM if not confirmed with credit card
                                </div>
                              )}
                              {reservation.status === 'NO_SHOW' && (
                                <div className="text-sm text-red-600">
                                  <AlertCircle className="h-4 w-4 inline mr-1" />
                                  Guest did not show up for this reservation.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-hotel" />
                              <span className="text-sm">Check-in: {formatDate(reservation.checkIn)}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-hotel" />
                              <span className="text-sm">Check-out: {formatDate(reservation.checkOut)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-hotel" />
                              <span className="text-sm">Booked on: {formatDate(reservation.createdAt)}</span>
                            </div>
                          </div>
                          <div>
                            <RoomFeature title={`${reservation.room.capacity} Guests`} />
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Room Rate:</span>
                                <span className="font-medium">${reservation.room.price.toFixed(2)}</span>
                              </div>

                              {reservation.discountInfo && (
                                <>
                                  <div className="flex justify-between items-center text-green-600">
                                    <span>Bulk Booking Discount:</span>
                                    <span>-${reservation.discountInfo.discountAmount.toFixed(2)} ({reservation.discountInfo.discountPercentage}%)</span>
                                  </div>
                                  <div className="h-px bg-gray-200 my-2" />
                                  <div className="flex justify-between items-center font-semibold text-lg">
                                    <span>Final Amount:</span>
                                    <span className="text-green-600">${reservation.totalAmount.toFixed(2)}</span>
                                  </div>
                                  
                                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800 text-sm">
                                      🎉 You saved ${reservation.discountInfo.discountAmount.toFixed(2)} with bulk booking discount!
                                    </p>
                                  </div>
                                </>
                              )}

                              {!reservation.discountInfo && (
                                <div className="flex justify-between items-center font-semibold text-lg mt-2">
                                  <span>Total Amount:</span>
                                  <span>${reservation.totalAmount.toFixed(2)}</span>
                                </div>
                              )}

                              {reservation.status === "PENDING" && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <p className="text-yellow-800 text-sm">
                                    ⚠️ This reservation will be automatically cancelled at 7 PM if not confirmed with payment.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => handleViewDetails(reservation)}>View Details</Button>
                        {reservation.status === 'PENDING' && (
                          <Button 
                            variant="outline" 
                            className="border-green-500 text-green-700 hover:bg-green-50"
                            onClick={() => navigate(`/rooms/${reservation.roomType}/${reservation.roomId}`)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Add Credit Card
                          </Button>
                        )}
 {(reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && (
                          <>
                            <Button variant="outline" onClick={() => handleModifyReservation(reservation)}>Modify</Button>
                            <Button 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleCancelReservation(reservation)}
                            >
                              Cancel Reservation
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center p-8">
                  <h3 className="text-xl font-medium mb-2">No Reservations Found</h3>
                  <p className="text-muted-foreground mb-6">You don't have any active reservations at the moment.</p>
                  <Button asChild onClick={handleMakeReservation}>
                    <a href="/check-availability">Make a Reservation</a>
                  </Button>
                </Card>
              )}
            </div>
          )}
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 text-center">
              <h3 className="font-display text-xl mb-2">Need Assistance?</h3>
              <p className="text-gray-600">Our reservations team is available 24/7 to help with any questions.</p>
              <Button variant="link" onClick={handleContactUs}>
                Contact Us
              </Button>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-display text-xl mb-2">Modification Policy</h3>
              <p className="text-gray-600">Reservations can be modified up to 48 hours before check-in without penalty.</p>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-display text-xl mb-2">Cancellation Policy</h3>
              <p className="text-gray-600">Free cancellation up to 24 hours before check-in for most room types.</p>
              <p className="text-sm text-amber-700 mt-2">Unpaid reservations are automatically cancelled at 7PM</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* No-Show Billing Dialog */}
      <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process No-Show Billing</DialogTitle>
            <DialogDescription>
              This will charge the guest for not showing up for their reservation.
            </DialogDescription>
          </DialogHeader>
          
          {reservationToBill && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Reservation</p>
                  <p>{reservationToBill.id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Room</p>
                  <p>{reservationToBill.roomType}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Check-in</p>
                  <p>{formatDate(reservationToBill.check_in_date)}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="font-medium">Billing Amount</p>
                <p className="text-lg">
                  {reservationToBill.total_amount ? formatCurrency(reservationToBill.total_amount) : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">One night charge as per policy</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBillingDialog(false)}>Cancel</Button>
            <Button 
              variant="default" 
              className="bg-hotel hover:bg-hotel-light"
              onClick={handleNoShowBilling}
            >
              Process Charge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancellation Dialog */}
      <Dialog open={showCancellationDialog} onOpenChange={setShowCancellationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this reservation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">Reason for Cancellation</Label>
              <Input 
                id="cancellation-reason" 
                value={cancellationReason} 
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Change of plans, found better rate, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancellationDialog(false)}>Back</Button>
            <Button 
              variant="destructive"
              onClick={confirmCancellation}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* No-Show Reports Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>No-Show Reports</DialogTitle>
            <DialogDescription>
              View and download no-show reports for your property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Reservations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No-Shows</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockNoShowReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(report.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.totalReservations}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.noShowCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.revenue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="default" 
              className="bg-hotel hover:bg-hotel-light"
              onClick={() => setShowReportDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alert Dialog for Auto-Cancellation Confirmation */}
      <AlertDialog open={showCancellationAlert} onOpenChange={setShowCancellationAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Auto-Cancel Unpaid Reservations?</AlertDialogTitle>
            <AlertDialogDescription>
              This will automatically cancel all unpaid reservations that have not been paid by the 7PM deadline.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAutoCancellation}>
              Proceed with Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ReservationsPage;
