
import React from 'react';
import RoomDetail, { RoomDetailProps } from '@/pages/RoomDetail';

const StandardRoom = () => {
  const roomData: RoomDetailProps = {
    title: "Standard Room",
    description: "Comfortable and affordable accommodations",
    price: 119,
    capacity: 2,
    size: 320,
    bedType: "Queen Size",
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Flat-screen TV",
      "In-room Safe",
      "Hairdryer",
      "Workspace",
      "Daily Housekeeping"
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        alt: "Standard Room Main View"
      },
      {
        src: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg",
        alt: "Standard Room - Bathroom"
      }
    ],
    longDescription: [
      "Our Standard Room offers comfortable accommodations at an affordable price. Perfect for business travelers or short stays, this room provides all the essentials you need for a pleasant stay.",
      "The room features a comfortable queen-sized bed with quality linens and pillows. The practical layout maximizes space while providing all necessary amenities for your convenience.",
      "Each Standard Room includes a private bathroom with shower, complimentary WiFi, and daily housekeeping service to ensure your comfort throughout your stay."
    ]
  };

  return <RoomDetail {...roomData} />;
};

export default StandardRoom;
