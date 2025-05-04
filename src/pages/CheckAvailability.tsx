
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Users, BedDouble, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Room type definition
interface Room {
  id: string;
  type: string;
  description: string;
  capacity: number;
  price: number;
  image: string;
}

const CheckAvailability = () => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState('2');
  const [roomType, setRoomType] = useState('any');
  const [availableRooms, setAvailableRooms] = useState<Room[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const { toast } = useToast();

  // Mock room data - in a real app, this would come from an API
  const mockRooms: Room[] = [
    {
      id: '1',
      type: 'standard',
      description: 'Standard Room with queen-sized bed',
      capacity: 2,
      price: 119,
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
    },
    {
      id: '2',
      type: 'deluxe',
      description: 'Deluxe Room with king-sized bed and city view',
      capacity: 2,
      price: 159,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
    },
    {
      id: '3',
      type: 'twin',
      description: 'Twin Room with two double beds',
      capacity: 4,
      price: 129,
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
    },
    {
      id: '4',
      type: 'executive',
      description: 'Executive Suite with separate living area',
      capacity: 2,
      price: 249,
      image: 'https://images.pexels.com/photos/7534561/pexels-photo-7534561.jpeg'
    },
    {
      id: '5',
      type: 'luxury',
      description: 'Luxury Suite with panoramic views',
      capacity: 2,
      price: 399,
      image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    // Process availability check
    console.log('Checking availability:', { checkInDate, checkOutDate, guests, roomType });
    
    // Filter rooms based on selection
    const guestsCount = parseInt(guests, 10);
    let filtered = mockRooms.filter(room => room.capacity >= guestsCount);
    
    if (roomType !== 'any') {
      filtered = filtered.filter(room => room.type === roomType);
    }
    
    setAvailableRooms(filtered);
    setHasSearched(true);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('availability-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Show success toast
    toast({
      title: "Search Complete!",
      description: `Found ${filtered.length} available room${filtered.length === 1 ? '' : 's'} for your dates.`,
      duration: 3000,
    });
  };

  const handleBookRoom = (room: Room) => {
    toast({
      title: "Room Selected",
      description: `You've selected the ${room.type} room. Proceeding to booking.`,
      duration: 3000,
    });
    // In a real app, this would navigate to a booking form or add to cart
  };

  return (
    <Layout>
      <div className="bg-hotel-bg py-12">
        <div className="hotel-container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">Check Room Availability</h1>
          <p className="text-center max-w-2xl mx-auto mb-8 text-gray-600">
            Find the perfect accommodation for your stay. Enter your dates, number of guests, and preferred room type to check availability and rates.
          </p>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Find Your Perfect Room</CardTitle>
              <CardDescription className="text-center">Enter your stay details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Check-in Date Picker */}
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
                  
                  {/* Check-out Date Picker */}
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
                  
                  {/* Number of Guests */}
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
                  
                  {/* Room Type */}
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
                        <option value="standard">Standard Room</option>
                        <option value="deluxe">Deluxe Room</option>
                        <option value="executive">Executive Suite</option>
                        <option value="twin">Twin Room</option>
                        <option value="luxury">Luxury Suite</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Special Requests */}
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
                  disabled={!checkInDate || !checkOutDate}
                >
                  Check Availability
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col text-sm text-muted-foreground">
              <p>Best rate guarantee when booking directly through our website.</p>
            </CardFooter>
          </Card>
          
          {/* Search Results */}
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
              
              {availableRooms && availableRooms.length > 0 ? (
                <div className="space-y-6">
                  {availableRooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <img 
                            src={room.image} 
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
                              <Link to={`/rooms/${room.type === 'luxury' ? 'luxury-suite' : room.type}`}>
                                View Details
                              </Link>
                            </Button>
                            <Button 
                              onClick={() => handleBookRoom(room)}
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
          
          {/* Additional Information */}
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
