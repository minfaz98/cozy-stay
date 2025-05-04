
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock } from 'lucide-react';
import RoomFeature from '@/components/RoomFeature';

// Mock reservations data (in a real app, this would come from an API)
const mockReservations = [
  {
    id: 'res-001',
    roomType: 'Deluxe Room',
    checkIn: '2025-06-15',
    checkOut: '2025-06-18',
    guests: 2,
    status: 'confirmed',
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
    totalAmount: '$1,250.00',
    bookedOn: '2025-05-02',
  }
];

const ReservationsPage = () => {
  const [email, setEmail] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
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
              <h2 className="text-2xl font-display font-medium mb-6">Your Reservations</h2>
              
              {mockReservations.length > 0 ? (
                <div className="space-y-6">
                  {mockReservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <CardTitle>{reservation.roomType}</CardTitle>
                            <CardDescription>Confirmation: {reservation.id}</CardDescription>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            reservation.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </span>
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
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2">
                        <Button variant="outline">View Details</Button>
                        <Button variant="outline">Modify</Button>
                        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">Cancel Reservation</Button>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReservationsPage;
