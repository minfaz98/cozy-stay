import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import RoomFeature from '@/components/RoomFeature';
import RoomGallery from '@/components/RoomGallery';
import { Calendar, Users, Bed, Hotel, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
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
import { Textarea } from '@/components/ui/textarea';
import { roomsAPI, reservationsAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import {
  Checkbox
} from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ReservationData {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  totalAmount: number;
  creditCard?: {
    cardNumber: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    holderName: string;
  } | null;
}

// Sample data for fallback
const sampleRooms = {
  'SINGLE': {
    title: "Single Room",
    description: "Luxurious single room with a comfortable bed",
    price: 119,
    capacity: 1,
    size: 250,
    bedType: "Single Bed",
    amenities: ["WiFi", "TV", "Air Conditioning", "Work Desk", "Private Bathroom"],
    images: [
      {
        src: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        alt: "Single Room"
      }
    ],
    longDescription: [
      "Perfect for solo travelers, our Single Room offers a comfortable and efficient space.",
      "Features a single bed with premium bedding and a dedicated workspace.",
      "Includes a private bathroom with shower and essential amenities."
    ]
  },
  'DOUBLE': {
    title: "Double Room",
    description: "Spacious double room with city view",
    price: 159,
    capacity: 2,
    size: 350,
    bedType: "Queen Size",
    amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar", "City View", "Work Desk"],
    images: [
      {
        src: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
        alt: "Double Room"
      }
    ],
    longDescription: [
      "Ideal for couples or business travelers, our Double Room offers comfort and style.",
      "Features a queen-sized bed with premium linens and a spacious work area.",
      "Enjoy city views and modern amenities for a perfect stay."
    ]
  },
  'FAMILY': {
    title: "Family Room",
    description: "Perfect for families with multiple beds and extra space",
    price: 199,
    capacity: 4,
    size: 500,
    bedType: "Multiple Beds",
    amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar", "Extra Beds", "Family Bathroom"],
    images: [
      {
        src: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        alt: "Family Room"
      }
    ],
    longDescription: [
      "Spacious family accommodation with multiple beds and extra space.",
      "Perfect for families or small groups traveling together.",
      "Includes family-friendly amenities and a large bathroom."
    ]
  },
  'DELUXE': {
    title: "Deluxe Room",
    description: "Luxury room with premium amenities and city view",
    price: 249,
    capacity: 2,
    size: 450,
    bedType: "King Size",
    amenities: ["Premium WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "City View", "Work Desk", "Room Service"],
    images: [
      {
        src: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
        alt: "Deluxe Room"
      }
    ],
    longDescription: [
      "Experience luxury in our Deluxe Room with premium amenities.",
      "Features a king-sized bed and stunning city views.",
      "Includes exclusive services and high-end amenities."
    ]
  },
  'SUITE': {
    title: "Executive Suite",
    description: "Our finest accommodation with separate living area",
    price: 399,
    capacity: 2,
    size: 650,
    bedType: "King Size",
    amenities: ["Premium WiFi", "Smart TV", "Air Conditioning", "Full Mini Bar", "City View", "Work Desk", "Room Service", "Separate Living Area"],
    images: [
      {
        src: "https://images.pexels.com/photos/7534561/pexels-photo-7534561.jpeg",
        alt: "Executive Suite"
      }
    ],
    longDescription: [
      "Our most luxurious accommodation with separate living and sleeping areas.",
      "Features premium furnishings and exclusive services.",
      "Perfect for those seeking the ultimate hotel experience."
    ]
  }
};

const RoomDetail: React.FC = () => {
  const { type, id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState('1');
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
  const [useCard, setUseCard] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // Try to fetch from backend first
        const response = await roomsAPI.getRoom(id!);
        if (response.data) {
          // Transform backend data to match our frontend format
          const transformedRoom = {
            id: response.data.id,
            title: `${response.data.type.charAt(0).toUpperCase() + response.data.type.slice(1)} Room`,
            description: response.data.description || 'Comfortable and well-appointed room',
            price: response.data.price,
            capacity: response.data.capacity || 2,
            size: response.data.size || 320,
            bedType: response.data.bedType || 'Queen Size',
            amenities: response.data.amenities || ['WiFi', 'TV', 'Air Conditioning'],
            images: [{ src: response.data.image, alt: response.data.type }]
          };
          setRoom(transformedRoom);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
        // Use sample data as fallback based on type
        const roomType = type?.toUpperCase() || 'SINGLE';
        setRoom(sampleRooms[roomType as keyof typeof sampleRooms] || sampleRooms.SINGLE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [id, type]);

  useEffect(() => {
    const calculatePrice = async () => {
      if (selectedDates?.from && selectedDates?.to) {
        try {
          const response = await roomsAPI.calculatePrice(id!, {
            checkIn: selectedDates.from.toISOString(),
            checkOut: selectedDates.to.toISOString()
          });
          setPriceBreakdown(response.data);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to calculate price. Please try again.",
          });
        }
      }
    };

    calculatePrice();
  }, [selectedDates, id, toast]);

  const handleBookNow = () => {
    if (!user) {
      // Store booking data in localStorage
      const bookingData = {
        roomId: id,
        checkIn: checkIn ? format(checkIn, 'yyyy-MM-dd') : null,
        checkOut: checkOut ? format(checkOut, 'yyyy-MM-dd') : null,
        guests: parseInt(guests),
        specialRequests
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/login', { state: { from: `/rooms/${type}/${id}` } });
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        variant: "destructive",
        title: "Invalid dates",
        description: "Please select both check-in and check-out dates.",
      });
      return;
    }

    setIsBookingDialogOpen(true);
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !room || !user) return;

    if (useCard) {
      // Validate credit card details
      const { cardNumber, expiryMonth, expiryYear, cvv, holderName } = cardDetails;
      
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
    }

    setLoading(true);
    try {
      const response = await reservationsAPI.createReservation({
        roomId: id!,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: parseInt(guests),
        totalAmount: room.price,
        ...(useCard && {
          creditCard: {
            cardNumber: cardDetails.cardNumber,
            expiryMonth: parseInt(cardDetails.expiryMonth),
            expiryYear: parseInt(cardDetails.expiryYear),
            cvv: cardDetails.cvv,
            holderName: cardDetails.holderName.trim()
          }
        })
      });

      if (response.data) {
        toast({
          title: "Booking Successful!",
          description: useCard 
            ? "Your reservation is confirmed! A confirmation email has been sent to your email address."
            : "Your reservation is pending. Please note that it will be automatically cancelled at 7 PM if not confirmed with a credit card.",
        });
        navigate('/reservations');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login', { state: { from: `/rooms/${type}/${id}` } });
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please log in again to complete your booking.",
        });
      } else {
        const errorMessage = error.response?.data?.message || 
                           (error.response?.data?.error?.message) || 
                           "Failed to book the room. Please try again.";
        toast({
          variant: "destructive",
          title: "Booking failed",
          description: errorMessage,
        });
      }
    } finally {
      setIsBookingDialogOpen(false);
      setLoading(false);
    }
  };

  if (isLoading || !room) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <ol className="flex flex-wrap items-center">
              <li>
                <Link to="/" className="hover:text-hotel">Home</Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link to="/rooms" className="hover:text-hotel">Rooms</Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-hotel-dark font-medium">{room.title}</li>
            </ol>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-display font-bold text-hotel mb-2">{room.title}</h1>
              <p className="text-gray-600 mb-6">{room.description}</p>
              
              {/* Room Gallery */}
              <RoomGallery images={room.images} />
              
              <div className="mt-8">
                <h2 className="text-2xl font-display font-semibold mb-4">Room Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-hotel mb-1">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold">Capacity</span>
                    </div>
                    <p>{room.capacity} {room.capacity > 1 ? 'Persons' : 'Person'}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-hotel mb-1">
                      <Hotel className="h-5 w-5" />
                      <span className="font-semibold">Size</span>
                    </div>
                    <p>{room.size} sq ft</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-hotel mb-1">
                      <Bed className="h-5 w-5" />
                      <span className="font-semibold">Bed</span>
                    </div>
                    <p>{room.bedType}</p>
                  </div>
                </div>

                {room.longDescription?.map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                ))}
              </div>

              <Separator className="my-8" />

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-display font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.amenities.map((amenity: string, index: number) => (
                    <RoomFeature key={index} title={amenity} />
                  ))}
                </div>
              </div>

              <Separator className="my-8" />

              {/* Policies */}
              <div>
                <h2 className="text-2xl font-display font-semibold mb-4">Policies</h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-hotel-dark">Check-in</h3>
                    <p>From 3:00 PM - Midnight</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-hotel-dark">Check-out</h3>
                    <p>Until 11:00 AM</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-hotel-dark">Cancellation</h3>
                    <p>Free cancellation up to 24 hours before check-in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl">${room.price}</h3>
                  <span className="text-gray-500">per night</span>
                </div>
                
                <Separator className="my-4" />
                
                {/* Check-in Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Check-in Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Check-out Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        initialFocus
                        disabled={(date) => date < (checkIn || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Guests */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Number of Guests</SelectLabel>
                        {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Credit Card Section */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useCard"
                      checked={useCard}
                      onCheckedChange={(checked) => setUseCard(checked as boolean)}
                    />
                    <label
                      htmlFor="useCard"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pay with Credit Card
                    </label>
                  </div>

                  {useCard && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div>
                        <Label>Card Number</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails(prev => ({
                            ...prev,
                            cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)
                          }))}
                          required={useCard}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Expiry Month</Label>
                          <Input
                            placeholder="MM"
                            value={cardDetails.expiryMonth}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2)
                            }))}
                            required={useCard}
                          />
                        </div>
                        <div>
                          <Label>Expiry Year</Label>
                          <Input
                            placeholder="YYYY"
                            value={cardDetails.expiryYear}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              expiryYear: e.target.value.replace(/\D/g, '').slice(0, 4)
                            }))}
                            required={useCard}
                          />
                        </div>
                        <div>
                          <Label>CVV</Label>
                          <Input
                            type="password"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                            }))}
                            required={useCard}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Card Holder Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={cardDetails.holderName}
                          onChange={(e) => setCardDetails(prev => ({
                            ...prev,
                            holderName: e.target.value
                          }))}
                          required={useCard}
                        />
                      </div>
                    </div>
                  )}

                  {!useCard && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ Without credit card payment, your reservation will be pending and will be automatically cancelled at 7 PM if not confirmed.
                      </p>
                    </div>
                  )}
                </div>

                {checkIn && checkOut && (
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span>${room.price} x {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                      <span>${room.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${room.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-hotel hover:bg-hotel-light mb-4"
                  onClick={handleBookNow}
                  disabled={!checkIn || !checkOut || (useCard && (!cardDetails.cardNumber || !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv || !cardDetails.holderName))}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Book Now
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  No payment charged yet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Confirmation Dialog */}
      <AlertDialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>You are about to book the {room.title} at ${room.price} per night.</p>
                <div className="mt-4 space-y-2">
                  <p className="font-medium">Booking Details:</p>
                  <ul className="list-none space-y-1">
                    <li>• Check-in: {checkIn ? format(checkIn, 'PPP') : 'Not selected'}</li>
                    <li>• Check-out: {checkOut ? format(checkOut, 'PPP') : 'Not selected'}</li>
                    <li>• Guests: {guests}</li>
                    <li>• Total: ${checkIn && checkOut ? room.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0}</li>
                    <li>• Payment Method: {useCard ? 'Credit Card' : 'No Credit Card (will be cancelled at 7 PM)'}</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Any special requests? (optional)
                  </label>
                  <Textarea
                    placeholder="E.g., early check-in, specific floor, etc."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBooking}>
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default RoomDetail;
