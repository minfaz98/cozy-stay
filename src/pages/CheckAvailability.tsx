
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Users, BedDouble } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const CheckAvailability = () => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState('2');
  const [roomType, setRoomType] = useState('any');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process availability check (would connect to backend API)
    console.log('Checking availability:', { checkInDate, checkOutDate, guests, roomType });
    // In a real app, this would trigger an API call and handle the response
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
