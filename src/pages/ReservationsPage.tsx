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

// Mock reservations data (in a real app, this would come from an API)
const mockReservations = [
  {
    id: 'res-001',
    roomType: 'Deluxe Room',
    checkIn: '2025-06-15',
    checkOut: '2025-06-18',
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: '$780.00',
    bookedOn: '2025-05-01',
  },
  {
    id: 'res-002',
    roomType: 'Executive Suite',
    checkIn: '2025-07-22',
    checkOut: '2025-07-25',
    guests: 3,
    status: 'pending',
    paymentStatus: 'unpaid',
    totalAmount: '$1,250.00',
    bookedOn: '2025-05-02',
  },
  {
    id: 'res-003',
    roomType: 'Standard Room',
    checkIn: '2025-05-10',
    checkOut: '2025-05-12',
    guests: 1,
    status: 'confirmed',
    paymentStatus: 'unpaid',
    totalAmount: '$420.00',
    bookedOn: '2025-05-03',
  }
];

// Mock no-show reports
const mockNoShowReports = [
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
  const [email, setEmail] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCancellationAlert, setShowCancellationAlert] = useState(false);
  const [reservationToBill, setReservationToBill] = useState<any>(null);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [localReservations, setLocalReservations] = useState(mockReservations);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAutoCancelInfo, setShowAutoCancelInfo] = useState(false);
  
  // Update the current time every minute to check for auto-cancellations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkForAutoCancellations();
    }, 60000); // Every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Function to check for reservations that should be auto-cancelled
  const checkForAutoCancellations = () => {
    const now = new Date();
    const isPM7 = now.getHours() === 19 && now.getMinutes() === 0;
    
    // For demo purposes, we're checking if the user just opened the alert
    if (!showAutoCancelInfo) {
      const unpaidReservations = localReservations.filter(res => 
        res.paymentStatus === 'unpaid' && res.status === 'confirmed'
      );
      
      if (unpaidReservations.length > 0) {
        setShowAutoCancelInfo(true);
      }
    }
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate credentials via API
    setIsLoggedIn(true);
  };
  
  const handleFindReservation = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search for the reservation
    setIsLoggedIn(true);
  };

  // Function to handle auto-cancellation of unpaid bookings
  const handleAutoCancellation = () => {
    // In a real app, this would make API calls to cancel the unpaid reservations
    const updatedReservations = localReservations.map(res => {
      if (res.paymentStatus === 'unpaid' && res.status === 'confirmed') {
        return { ...res, status: 'cancelled', cancellationReason: 'Auto-cancelled (unpaid at 7PM)' };
      }
      return res;
    });
    
    setLocalReservations(updatedReservations);
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
    
    // In a real app, this would process payment through a payment gateway
    const updatedReservations = localReservations.map(res => {
      if (res.id === reservationToBill.id) {
        return { ...res, paymentStatus: 'charged', status: 'no-show' };
      }
      return res;
    });
    
    setLocalReservations(updatedReservations);
    setShowBillingDialog(false);
    
    toast({
      title: "No-show billing complete",
      description: `${reservationToBill.roomType} has been billed for no-show.`,
      duration: 5000,
    });
  };
  
  // Function to generate no-show report
  const generateNoShowReport = () => {
    // In a real app, this would generate a proper report and possibly offer download
    console.log("Generating no-show report...");
    setShowReportDialog(true);
  };

  return (
    <Layout>
      <div className="bg-hotel-bg py-12">
        <div className="hotel-container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">Manage Your Reservations</h1>
          
          {!isLoggedIn ? (
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
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="you@example.com" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input 
                            id="password" 
                            type="password"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full mt-6 bg-hotel hover:bg-hotel-light">
                        Login
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
              
              {localReservations.length > 0 ? (
                <div className="space-y-6">
                  {localReservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <CardTitle>{reservation.roomType}</CardTitle>
                            <CardDescription>Confirmation: {reservation.id}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              reservation.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : reservation.status === 'no-show'
                                ? 'bg-red-100 text-red-800'
                                : reservation.status === 'cancelled'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              reservation.paymentStatus === 'paid' 
                                ? 'bg-blue-100 text-blue-800' 
                                : reservation.paymentStatus === 'charged'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              Payment: {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-hotel" />
                              <span className="text-sm">Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-hotel" />
                              <span className="text-sm">Check-out: {new Date(reservation.checkOut).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-hotel" />
                              <span className="text-sm">Booked on: {new Date(reservation.bookedOn).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div>
                            <RoomFeature title={`${reservation.guests} Guests`} />
                            <p className="mt-2 font-medium">Total: {reservation.totalAmount}</p>
                            {reservation.cancellationReason && (
                              <p className="mt-1 text-sm text-red-600">
                                Reason: {reservation.cancellationReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2">
                        <Button variant="outline">View Details</Button>
                        {reservation.status !== 'cancelled' && reservation.status !== 'no-show' && (
                          <>
                            <Button variant="outline">Modify</Button>
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              Cancel Reservation
                            </Button>
                          </>
                        )}
                        {reservation.status === 'confirmed' && new Date(reservation.checkIn) <= currentTime && (
                          <Button 
                            variant="outline" 
                            className="border-amber-500 text-amber-700 hover:bg-amber-50"
                            onClick={() => {
                              setReservationToBill(reservation);
                              setShowBillingDialog(true);
                            }}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Mark as No-Show & Bill
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center p-8">
                  <h3 className="text-xl font-medium mb-2">No Reservations Found</h3>
                  <p className="text-muted-foreground mb-6">You don't have any active reservations at the moment.</p>
                  <Button asChild>
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
              <Button variant="link" asChild>
                <a href="/contact">Contact Us</a>
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
                  <p>{reservationToBill.id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Room</p>
                  <p>{reservationToBill.roomType}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Check-in</p>
                  <p>{new Date(reservationToBill.checkIn).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="font-medium">Billing Amount</p>
                <p className="text-lg">{reservationToBill.totalAmount}</p>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(report.date).toLocaleDateString()}</td>
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
