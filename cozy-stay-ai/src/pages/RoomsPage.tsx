import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { roomsAPI } from '@/services/api';
import { toast } from 'sonner';

interface RoomPreviewProps {
  imgSrc: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
  href: string;
}

const RoomPreview: React.FC<RoomPreviewProps> = ({
  imgSrc,
  title,
  description,
  price,
  amenities,
  href
}) => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="md:w-1/3 h-60 md:h-auto relative">
        <img 
          src={imgSrc} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-hotel-accent text-white px-3 py-1 m-2 rounded">
          ${price}/night
        </div>
      </div>
      <div className="md:w-2/3 p-6">
        <h3 className="text-2xl font-display font-semibold text-hotel-dark mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Separator className="mb-4" />
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Room Features:</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 5).map((amenity, index) => (
              <span 
                key={index} 
                className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 5 && (
              <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                +{amenities.length - 5} more
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-hotel hover:bg-hotel-light" asChild>
            <Link to={href}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data as fallback
  const sampleRooms = [
    {
      imgSrc: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      title: "Deluxe King Room",
      description: "Spacious room with king-sized bed and city view",
      price: 159,
      amenities: ["King Bed", "City View", "Free Wi-Fi", "Room Service", "Air Conditioning", "Flat-screen TV"],
      href: "/rooms/deluxe"
    },
    {
      imgSrc: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
      title: "Standard Room",
      description: "Comfortable and affordable accommodations",
      price: 119,
      amenities: ["Queen Bed", "Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "In-room Safe", "Hairdryer"],
      href: "/rooms/standard"
    },
    {
      imgSrc: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
      title: "Premium Twin Room",
      description: "Comfortable room with two double beds",
      price: 129,
      amenities: ["Two Double Beds", "Bathtub", "Free Wi-Fi", "Room Service", "Air Conditioning", "Mini Refrigerator"],
      href: "/rooms/twin"
    },
    {
      imgSrc: "https://images.pexels.com/photos/7534561/pexels-photo-7534561.jpeg",
      title: "Executive Suite",
      description: "Luxury suite with separate living area and premium amenities",
      price: 249,
      amenities: ["King Bed", "Separate Living Area", "Ocean View", "Premium Mini Bar", "Espresso Machine", "Luxury Bath"],
      href: "/rooms/executive"
    },
    {
      imgSrc: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
      title: "Luxury Suite",
      description: "Our finest accommodation with panoramic views and exclusive amenities",
      price: 399,
      amenities: ["King Bed", "Private Balcony", "Panoramic View", "Butler Service", "Full Premium Mini Bar", "Luxury Bath"],
      href: "/rooms/luxury-suite"
    }
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomsAPI.listRooms();
        console.log(response,'kk');

        if (response.data?.data && response.data.data.length > 0) {
          // Transform backend data to match our frontend format
          const transformedRooms = response.data.data.map(room => ({
            roomId: room.id,
            imgSrc: room.image || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
            title: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room`,
            description: room.description || 'Comfortable and well-appointed room',
            price: room.price,
            amenities: room.amenities || ['WiFi', 'TV', 'Air Conditioning'],
            href: `/rooms/${room.type.toLowerCase()}/${room.id}`
          }));
          
          setRooms(transformedRooms);
        } 
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to fetch rooms. Using sample data instead.');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
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
      <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-hotel mb-4">Our Rooms & Suites</h1>
            <div className="flex justify-center items-center mb-4">
              <Bed className="text-hotel h-6 w-6 mr-2" />
              <h2 className="text-xl text-gray-600">Find your perfect accommodation</h2>
            </div>
            <p className="max-w-2xl mx-auto text-gray-600">
              From comfortable standard rooms to luxurious suites, we offer a variety of 
              accommodations to meet your needs and preferences.
            </p>
          </div>

          <div className="space-y-6">
            {rooms.map((room, index) => (
              <RoomPreview key={index} {...room} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomsPage;
