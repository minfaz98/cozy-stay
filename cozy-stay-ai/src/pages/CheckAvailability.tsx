import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Users, BedDouble, CheckCircle, Building2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { roomsAPI, reservationsAPI } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Room type definition
interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: string;
  amenities: string[];
  description: string;
  capacity: number;
  image?: string;
}

const CheckAvailability = () => {
  const location = useLocation();
  const searchParams = location.state;

  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    searchParams?.checkIn ? new Date(searchParams.checkIn) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    searchParams?.checkOut ? new Date(searchParams.checkOut) : undefined
  );
  const [guests, setGuests] = useState(searchParams?.guests?.toString() || '2');
  const [roomType, setRoomType] = useState(searchParams?.roomType || 'any');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isBulkBookingOpen, setIsBulkBookingOpen] = useState(false);
  const [bulkBookingData, setBulkBookingData] = useState({
    roomType: 'SINGLE' as 'SINGLE' | 'DOUBLE' | 'FAMILY' | 'DELUXE' | 'SUITE',
    numberOfRooms: 2,
    specialRequests: '',
    creditCard: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: ''
    }
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Automatically search when navigated with search params
  useEffect(() => {
    if (searchParams?.checkIn && searchParams?.checkOut) {
      handleSubmit(new Event('submit') as React.FormEvent);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await roomsAPI.listRooms();
      let filteredRooms = response.data.data;
      
      // Filter by room type if specified
      if (roomType !== 'any') {
        filteredRooms = filteredRooms.filter(room => 
          room.type.toUpperCase() === roomType.toUpperCase()
        );
      }
      
      // Filter by capacity
      const guestsCount = parseInt(guests, 10);
      filteredRooms = filteredRooms.filter(room => room.capacity >= guestsCount);
      
      // Filter by availability
      filteredRooms = filteredRooms.filter(room => room.status === 'AVAILABLE');
      
      setAvailableRooms(filteredRooms);
      setHasSearched(true);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('availability-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      toast({
        title: "Search Complete!",
        description: `Found ${filteredRooms.length} available room${filteredRooms.length === 1 ? '' : 's'} for your dates.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate discount rate based on number of rooms
  const getDiscountRate = (numberOfRooms: number): number => {
    if (numberOfRooms >= 10) return 0.30;  // 30% discount
    if (numberOfRooms >= 5) return 0.20;   // 20% discount
    if (numberOfRooms >= 3) return 0.15;   // 15% discount
    return 0.10;                           // 10% discount
  };

  const handleBulkBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (bulkBookingData.numberOfRooms < 2) {
      toast({
        title: "Invalid number of rooms",
        description: "Minimum 2 rooms required for bulk booking.",
        variant: "destructive",
      });
      return;
    }

    // Validate credit card details
    const { cardNumber, expiryMonth, expiryYear, cvv, holderName } = bulkBookingData.creditCard;
    
    if (!cardNumber || cardNumber.length !== 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number.",
        variant: "destructive",
      });
      return;
    }

    const month = parseInt(expiryMonth);
    const year = parseInt(expiryYear);
    const currentYear = new Date().getFullYear();

    if (!month || month < 1 || month > 12) {
      toast({
        title: "Invalid Expiry Month",
        description: "Please enter a valid month (1-12).",
        variant: "destructive",
      });
      return;
    }

    if (!year || year < currentYear) {
      toast({
        title: "Card Expired",
        description: "Please enter a valid expiry year.",
        variant: "destructive",
      });
      return;
    }

    if (!cvv || !/^\d{3,4}$/.test(cvv)) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3 or 4 digit CVV.",
        variant: "destructive",
      });
      return;
    }

    if (!holderName.trim()) {
      toast({
        title: "Invalid Card Holder Name",
        description: "Please enter the card holder's name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check room availability for the selected dates
      const response = await roomsAPI.listRooms({
        type: bulkBookingData.roomType,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString()
      });

      const availableRooms = response.data.data.filter(room => 
        !room.reservations.some(res => 
          (new Date(res.checkIn) <= checkOutDate && new Date(res.checkOut) >= checkInDate)
        )
      );

      if (availableRooms.length < bulkBookingData.numberOfRooms) {
        toast({
          title: "Not enough rooms",
          description: `Only ${availableRooms.length} ${bulkBookingData.roomType.toLowerCase()} rooms are available for the selected dates.`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create bulk reservation
      const response2 = await reservationsAPI.createBulkReservation({
        roomType: bulkBookingData.roomType,
        numberOfRooms: bulkBookingData.numberOfRooms,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        discountRate: getDiscountRate(bulkBookingData.numberOfRooms),
        specialRequests: bulkBookingData.specialRequests,
        creditCard: {
          cardNumber: cardNumber,
          expiryMonth: month,
          expiryYear: year,
          cvv: cvv,
          holderName: holderName.trim()
        }
      });

      toast({
        title: "Success!",
        description: `Successfully booked ${bulkBookingData.numberOfRooms} ${bulkBookingData.roomType.toLowerCase()} rooms with a ${getDiscountRate(bulkBookingData.numberOfRooms) * 100}% discount!`,
      });
      
      setIsBulkBookingOpen(false);
      navigate('/reservations');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create bulk booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (room: Room) => {
    if (!user) {
      // Store the room ID and dates in localStorage for after login
      localStorage.setItem('pendingBooking', JSON.stringify({ 
        roomId: room.id,
        checkIn: checkInDate?.toISOString(),
        checkOut: checkOutDate?.toISOString(),
        guests: parseInt(guests),
        specialRequests
      }));
      navigate('/login', { state: { from: `/rooms/${room.type.toUpperCase()}/${room.id}` } });
      return;
    }
    navigate(`/rooms/${room.type.toUpperCase()}/${room.id}`, { 
      state: { 
        checkIn: checkInDate?.toISOString(),
        checkOut: checkOutDate?.toISOString(),
        guests: parseInt(guests),
        specialRequests
      }
    });
  };

  return (
    <Layout>
      <div className="bg-hotel-bg py-12">
        <div className="hotel-container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">Check Room Availability</h1>
          <p className="text-center max-w-2xl mx-auto mb-8 text-gray-600">
            Find the perfect accommodation for your stay. Enter your dates, number of guests, and preferred room type to check availability and rates.
          </p>

          {user?.role === 'COMPANY' && (
            <div className="flex justify-end mb-4">
              <Dialog open={isBulkBookingOpen} onOpenChange={setIsBulkBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-hotel hover:bg-hotel-light">
                    <Building2 className="mr-2 h-4 w-4" />
                    Bulk Booking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Room Booking</DialogTitle>
                    <DialogDescription>
                      Book multiple rooms of the same type for your company.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select
                        value={bulkBookingData.roomType}
                        onValueChange={(value: 'SINGLE' | 'DOUBLE' | 'FAMILY' | 'DELUXE' | 'SUITE') => 
                          setBulkBookingData(prev => ({ ...prev, roomType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single Room</SelectItem>
                          <SelectItem value="DOUBLE">Double Room</SelectItem>
                          <SelectItem value="FAMILY">Family Room</SelectItem>
                          <SelectItem value="DELUXE">Deluxe Room</SelectItem>
                          <SelectItem value="SUITE">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Check-in Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkInDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkInDate ? format(checkInDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkInDate}
                              onSelect={setCheckInDate}
                              initialFocus
                              disabled={(date) =>
                                date < new Date() || (checkOutDate ? date >= checkOutDate : false)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Check-out Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkOutDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkOutDate ? format(checkOutDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkOutDate}
                              onSelect={setCheckOutDate}
                              initialFocus
                              disabled={(date) =>
                                date <= (checkInDate || new Date())
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Rooms (Minimum 2)</Label>
                      <Input
                        type="number"
                        min="2"
                        value={bulkBookingData.numberOfRooms}
                        onChange={(e) => setBulkBookingData(prev => ({ 
                          ...prev, 
                          numberOfRooms: Math.max(2, parseInt(e.target.value) || 2)
                        }))}
                      />
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Bulk Booking Discount</h4>
                      <div className="space-y-2">
                        <p className="text-green-700">
                          {bulkBookingData.numberOfRooms >= 10 ? (
                            "🎉 30% discount for booking 10 or more rooms!"
                          ) : bulkBookingData.numberOfRooms >= 5 ? (
                            "🎉 20% discount for booking 5 or more rooms!"
                          ) : bulkBookingData.numberOfRooms >= 3 ? (
                            "🎉 15% discount for booking 3 or more rooms!"
                          ) : (
                            "🎉 10% discount for bulk booking!"
                          )}
                        </p>
                        <p className="text-sm text-green-600">
                          {bulkBookingData.numberOfRooms < 10 && bulkBookingData.numberOfRooms < 5 && bulkBookingData.numberOfRooms < 3 && 
                            "Book more rooms to get higher discounts!"}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <h4 className="font-semibold">Credit Card Details</h4>
                      <div className="space-y-4">
                        <div>
                          <Label>Card Number</Label>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            value={bulkBookingData.creditCard.cardNumber}
                            onChange={(e) => setBulkBookingData(prev => ({
                              ...prev,
                              creditCard: {
                                ...prev.creditCard,
                                cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)
                              }
                            }))}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Expiry Month</Label>
                            <Input
                              placeholder="MM"
                              value={bulkBookingData.creditCard.expiryMonth}
                              onChange={(e) => setBulkBookingData(prev => ({
                                ...prev,
                                creditCard: {
                                  ...prev.creditCard,
                                  expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2)
                                }
                              }))}
                              required
                            />
                          </div>
                          <div>
                            <Label>Expiry Year</Label>
                            <Input
                              placeholder="YYYY"
                              value={bulkBookingData.creditCard.expiryYear}
                              onChange={(e) => setBulkBookingData(prev => ({
                                ...prev,
                                creditCard: {
                                  ...prev.creditCard,
                                  expiryYear: e.target.value.replace(/\D/g, '').slice(0, 4)
                                }
                              }))}
                              required
                            />
                          </div>
                          <div>
                            <Label>CVV</Label>
                            <Input
                              type="password"
                              placeholder="123"
                              value={bulkBookingData.creditCard.cvv}
                              onChange={(e) => setBulkBookingData(prev => ({
                                ...prev,
                                creditCard: {
                                  ...prev.creditCard,
                                  cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                                }
                              }))}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Card Holder Name</Label>
                          <Input
                            placeholder="John Doe"
                            value={bulkBookingData.creditCard.holderName}
                            onChange={(e) => setBulkBookingData(prev => ({
                              ...prev,
                              creditCard: {
                                ...prev.creditCard,
                                holderName: e.target.value
                              }
                            }))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Special Requests</Label>
                      <Textarea
                        value={bulkBookingData.specialRequests}
                        onChange={(e) => setBulkBookingData(prev => ({ 
                          ...prev, 
                          specialRequests: e.target.value 
                        }))}
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBulkBookingOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleBulkBooking}
                      disabled={loading}
                      className="bg-hotel hover:bg-hotel-light"
                    >
                      {loading ? "Booking..." : "Book Rooms"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Find Your Perfect Room</CardTitle>
              <CardDescription className="text-center">Enter your stay details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="check-in">Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkInDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="check-out">Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkOutDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          initialFocus
                          disabled={(date) => !checkInDate || date <= checkInDate}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <div className="bg-gray-100 p-2">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input
                        id="guests"
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        min="1"
                        max="10"
                        className="border-0 focus-visible:ring-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-type">Room Type</Label>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <div className="bg-gray-100 p-2">
                        <BedDouble className="h-5 w-5 text-gray-500" />
                      </div>
                      <select
                        id="room-type"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="flex h-10 w-full rounded-md border-0 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option value="any">Any Room Type</option>
                        <option value="SINGLE">Single Room</option>
                        <option value="DOUBLE">Double Room</option>
                        <option value="FAMILY">Family Room</option>
                        <option value="DELUXE">Deluxe Room</option>
                        <option value="SUITE">Suite</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special-requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="special-requests"
                    placeholder="Let us know if you have any special requests or requirements..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <Separator />
                
                <Button 
                  type="submit" 
                  className="w-full bg-hotel hover:bg-hotel-light text-white"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Check Availability"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col text-sm text-muted-foreground">
              <p>Best rate guarantee when booking directly through our website.</p>
            </CardFooter>
          </Card>

          {hasSearched && (
            <div id="availability-results" className="mt-12 max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                Available Rooms
                {checkInDate && checkOutDate && (
                  <span className="text-lg font-normal text-gray-600 block mt-2">
                    {format(checkInDate, "MMM d, yyyy")} - {format(checkOutDate, "MMM d, yyyy")}
                  </span>
                )}
              </h2>
              
              {availableRooms.length > 0 ? (
                <div className="space-y-6">
                  {availableRooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <img 
                            src={room.image || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'} 
                            alt={room.type} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-display font-semibold capitalize">
                                {room.type} Room
                              </h3>
                              <p className="text-gray-600 mt-1">{room.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-semibold">${room.price}</div>
                              <div className="text-sm text-gray-500">per night</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1" /> 
                            <span>Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
                          </div>
                          
                          <div className="flex mt-6 justify-end gap-3">
                            <Button
                              variant="outline" 
                              asChild
                            >
                              <Link to={`/rooms/${room.type.toUpperCase()}/${room.id}`}>
                                View Details
                              </Link>
                            </Button>
                            <Button 
                              onClick={() => handleBookNow(room)}
                              className="bg-hotel hover:bg-hotel-light"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-lg mb-2">No rooms available for your selected criteria.</p>
                  <p className="text-gray-600">Please try different dates or room types.</p>
                </Card>
              )}
            </div>
          )}
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <h3 className="font-display text-xl mb-2">Best Rate Guarantee</h3>
              <p className="text-gray-600">We promise the best rates when you book directly through our website.</p>
            </div>
            <div className="p-4">
              <h3 className="font-display text-xl mb-2">Flexible Cancellation</h3>
              <p className="text-gray-600">Plans change? Most rooms can be cancelled up to 24 hours before check-in.</p>
            </div>
            <div className="p-4">
              <h3 className="font-display text-xl mb-2">Special Requests</h3>
              <p className="text-gray-600">Have special requirements? Let us know when booking.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckAvailability;
