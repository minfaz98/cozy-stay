import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Bed, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RoomProps {
  imgSrc: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
  href: string;
}

const RoomCard: React.FC<RoomProps> = ({ imgSrc, title, description, price, amenities, href }) => {
  return (
    <Card className="overflow-hidden card-shadow group hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="h-full w-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500" 
          style={{ backgroundImage: `url('${imgSrc}')` }}
        />
        <div className="absolute top-0 right-0 bg-hotel-accent text-white px-3 py-1 m-2 rounded-full font-semibold">
          ${price}/night
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-hotel transition-colors">{title}</h3>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 3).map((amenity, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              +{amenities.length - 3} more
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button className="w-full bg-hotel hover:bg-hotel-light" asChild>
            <Link to={href}>View Details</Link>
          </Button>
          <Button variant="outline" className="border-hotel text-hotel hover:bg-hotel hover:text-white" asChild>
            <Link to={`/check-availability?room=${href.split('/').pop()}`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedRooms: React.FC = () => {
  const rooms = [
    {
      imgSrc: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      title: "Single Room",
      type: "SINGLE",
      id: "single-1",
      description: "Cozy and comfortable room perfect for solo travelers",
      price: 99,
      amenities: ["Single Bed", "Work Desk", "Free Wi-Fi", "Private Bathroom", "Air Conditioning"],
      capacity: 1,
      size: 250,
      bedType: "Single Bed"
    },
    {
      imgSrc: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
      title: "Double Room",
      type: "DOUBLE",
      id: "double-1",
      description: "Comfortable room with a queen-sized bed, perfect for couples",
      price: 129,
      amenities: ["Queen Bed", "City View", "Free Wi-Fi", "Mini Bar", "Work Desk", "Room Service"],
      capacity: 2,
      size: 350,
      bedType: "Queen Size"
    },
    {
      imgSrc: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
      title: "Family Room",
      type: "FAMILY",
      id: "family-1",
      description: "Spacious room designed for families, featuring multiple beds and extra amenities",
      price: 199,
      amenities: ["Multiple Beds", "Family Bathroom", "Free Wi-Fi", "Kids Area", "Mini Kitchen", "Extra Storage"],
      capacity: 4,
      size: 500,
      bedType: "Multiple Beds"
    },
    {
      imgSrc: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      title: "Deluxe Room",
      type: "DELUXE",
      id: "deluxe-1",
      description: "Luxurious room with premium amenities and stunning city views",
      price: 249,
      amenities: ["King Bed", "Premium View", "Free Wi-Fi", "Premium Mini Bar", "Room Service", "Luxury Bathroom"],
      capacity: 2,
      size: 450,
      bedType: "King Size"
    },
    {
      imgSrc: "https://images.pexels.com/photos/7534561/pexels-photo-7534561.jpeg",
      title: "Executive Suite",
      type: "SUITE",
      id: "suite-1",
      description: "Our finest accommodation with separate living area and exclusive amenities",
      price: 399,
      amenities: ["King Bed", "Living Room", "Ocean View", "Full Mini Bar", "Butler Service", "Premium Amenities"],
      capacity: 2,
      size: 650,
      bedType: "King Size"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="hotel-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-hotel mb-2">Featured Rooms</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience unparalleled comfort in our carefully designed rooms and suites
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <RoomCard 
              key={index} 
              imgSrc={room.imgSrc} 
              title={room.title} 
              description={room.description} 
              price={room.price} 
              amenities={room.amenities} 
              href={`/rooms/${room.type.toLowerCase()}/${room.id}`}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="border-hotel text-hotel hover:bg-hotel hover:text-white" asChild>
            <Link to="/rooms">View All Rooms</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const AmenitiesSection: React.FC = () => {
  const amenities = [
    { icon: '🍽️', title: 'Fine Dining', description: 'Gourmet restaurant with international cuisine' },
    { icon: '🏊', title: 'Swimming Pool', description: 'Outdoor pool with lounge area and bar' },
    { icon: '💆', title: 'Spa & Wellness', description: 'Full-service spa with massage and treatments' },
    { icon: '🏋️', title: 'Fitness Center', description: '24/7 access to modern gym equipment' }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="hotel-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-hotel mb-2">Hotel Amenities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enjoy our premium facilities designed for your comfort and convenience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">{amenity.icon}</div>
              <h3 className="text-xl font-display font-semibold mb-2">{amenity.title}</h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      text: "Our stay at Urban Red was exceptional. The staff was attentive and the room exceeded our expectations.",
      author: "Sarah Johnson",
      title: "Business Traveler"
    },
    {
      text: "The perfect getaway! Beautiful rooms, amazing service, and the restaurant serves delicious food.",
      author: "Michael Chen",
      title: "Family Vacation"
    },
    {
      text: "We had our company retreat here and everything was perfect. Highly recommend for business events.",
      author: "Emily Rodriguez",
      title: "Corporate Client"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="hotel-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-hotel mb-2">Guest Experiences</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear what our guests have to say
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-6 rounded-lg border border-gray-100"
            >
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('');
  const navigate = useNavigate();

  const handleCheckAvailability = () => {
    // Navigate to check-availability page with search params
    navigate('/check-availability', {
      state: {
        checkIn: checkInDate?.toISOString(),
        checkOut: checkOutDate?.toISOString(),
        guests,
        roomType
      }
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] min-h-[600px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: 'url("https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="hotel-container relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-display font-bold mb-4">Experience Luxury & Comfort</h1>
            <p className="text-xl mb-8">Discover the perfect balance of hospitality, luxury, and comfort at Urban Red.</p>
            <Button size="lg" className="bg-hotel-accent hover:brightness-110 text-white">
              Explore Rooms
            </Button>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="relative h-[600px] bg-hotel-bg">
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-8 shadow-lg">
          <div className="hotel-container grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Check-in Date</label>
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Check-out Date</label>
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium mb-1">Guests</label>
              <div className="flex items-center border rounded-md">
                <div className="bg-gray-100 p-2">
                  <Users className="h-4 w-4 text-gray-500" />
                </div>
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10"
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Room Types</SelectLabel>
                    <SelectItem value="SINGLE">Single Room</SelectItem>
                    <SelectItem value="DOUBLE">Double Room</SelectItem>
                    <SelectItem value="FAMILY">Family Room</SelectItem>
                    <SelectItem value="DELUXE">Deluxe Room</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="flex items-end md:col-span-4">
              <Button 
                className="w-full bg-hotel hover:bg-hotel-light"
                onClick={handleCheckAvailability}
                disabled={!checkInDate || !checkOutDate}
              >
                <Search className="mr-2 h-4 w-4" /> Check Availability
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <FeaturedRooms />

      {/* Amenities */}
      <AmenitiesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16 bg-hotel text-white">
        <div className="hotel-container text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to experience luxury?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your stay today and enjoy special rates and complimentary amenities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-hotel-accent hover:brightness-110 text-white">
              Book Now
            </Button>
            <Button size="lg" variant="outline" className="text-black border-white hover:bg-white hover:text-hotel">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
