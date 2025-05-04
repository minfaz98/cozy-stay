
import React from 'react';
import RoomDetail, { RoomDetailProps } from '@/pages/RoomDetail';

const LuxurySuite = () => {
  const roomData: RoomDetailProps = {
    title: "Luxury Suite",
    description: "Our finest accommodation with panoramic views and exclusive amenities",
    price: 399,
    capacity: 2,
    size: 850,
    bedType: "King Size",
    amenities: [
      "Free Premium Wi-Fi",
      "24/7 Room Service",
      "Climate Control",
      "Separate Living and Dining Areas",
      "Multiple Flat-screen TVs",
      "Full Premium Mini Bar",
      "Espresso Machine",
      "Wine Cooler",
      "In-room Safe",
      "Luxury Bath Amenities",
      "Deep Soaking Tub",
      "Rainfall Shower",
      "Hairdryer",
      "Panoramic Ocean View",
      "Private Balcony",
      "Daily Housekeeping",
      "Twice Daily Turndown Service",
      "Complimentary Breakfast",
      "Private Check-in/Check-out",
      "Access to Executive Lounge",
      "Complimentary Airport Transfer",
      "Personal Butler Service"
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
        alt: "Luxury Suite Main View"
      },
      {
        src: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
        alt: "Luxury Suite - Living Area"
      },
      {
        src: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg",
        alt: "Luxury Suite - Bedroom"
      },
      {
        src: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg",
        alt: "Luxury Suite - Bathroom"
      },
      {
        src: "https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg",
        alt: "Luxury Suite - Private Balcony"
      }
    ],
    longDescription: [
      "Experience the pinnacle of luxury with our signature Luxury Suite. This expansive accommodation offers unrivaled comfort, breathtaking panoramic views, and the highest level of service for an unforgettable stay.",
      "The suite features separate living, dining, and sleeping areas, providing the perfect setting for both relaxation and entertaining. The master bedroom includes a sumptuous king-sized bed with the finest quality linens and pillows for ultimate comfort.",
      "Floor-to-ceiling windows showcase spectacular panoramic views of the ocean, while a private balcony allows you to enjoy the fresh air and scenery in complete privacy. The elegantly appointed living area includes comfortable seating and state-of-the-art entertainment options.",
      "The marble bathroom is a sanctuary of relaxation with a deep soaking tub, separate rainfall shower, and double vanities. Luxury bath amenities, plush robes, and slippers complete the experience.",
      "Guests of our Luxury Suite enjoy exclusive privileges including personal butler service, private check-in/check-out, complimentary airport transfers, and access to our Executive Lounge with all-day refreshments and evening cocktails."
    ]
  };

  return <RoomDetail {...roomData} />;
};

export default LuxurySuite;
