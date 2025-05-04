
import React from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import RoomFeature from '@/components/RoomFeature';
import RoomGallery from '@/components/RoomGallery';
import { Calendar, Users, Bed, Hotel } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

export interface RoomDetailProps {
  title: string;
  description: string;
  price: number;
  capacity: number;
  size: number;
  bedType: string;
  amenities: string[];
  images: {
    src: string;
    alt: string;
  }[];
  longDescription: string[];
}

const RoomDetail: React.FC<RoomDetailProps> = ({
  title,
  description,
  price,
  capacity,
  size,
  bedType,
  amenities,
  images,
  longDescription,
}) => {
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
              <li className="text-hotel-dark font-medium">{title}</li>
            </ol>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-display font-bold text-hotel mb-2">{title}</h1>
              <p className="text-gray-600 mb-6">{description}</p>
              
              {/* Room Gallery */}
              <RoomGallery images={images} />
              
              <div className="mt-8">
                <h2 className="text-2xl font-display font-semibold mb-4">Room Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-hotel mb-1">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold">Capacity</span>
                    </div>
                    <p>{capacity} {capacity > 1 ? 'Persons' : 'Person'}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-hotel mb-1">
                      <Hotel className="h-5 w-5" />
                      <span className="font-semibold">Size</span>
                    </div>
                    <p>{size} sq ft</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-hotel mb-1">
                      <Bed className="h-5 w-5" />
                      <span className="font-semibold">Bed</span>
                    </div>
                    <p>{bedType}</p>
                  </div>
                </div>

                {longDescription.map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                ))}
              </div>

              <Separator className="my-8" />

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-display font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {amenities.map((amenity, index) => (
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
                  <h3 className="font-display font-bold text-xl">${price}</h3>
                  <span className="text-gray-500">per night</span>
                </div>
                
                <Separator className="my-4" />
                
                {/* Availability Calendar Placeholder */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Dates</label>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Select dates</span>
                  </Button>
                </div>
                
                {/* Guests Dropdown Placeholder */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Guests</label>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Users className="mr-2 h-4 w-4" />
                    <span>{capacity} {capacity > 1 ? 'guests' : 'guest'} maximum</span>
                  </Button>
                </div>
                
                <Button className="w-full bg-hotel hover:bg-hotel-light mb-4">
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
    </Layout>
  );
};

export default RoomDetail;
