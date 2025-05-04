
import React from 'react';
import RoomDetail, { RoomDetailProps } from '@/pages/RoomDetail';

const DeluxeRoom = () => {
  const roomData: RoomDetailProps = {
    title: "Deluxe Room",
    description: "Spacious room with king-sized bed and city view",
    price: 159,
    capacity: 2,
    size: 400,
    bedType: "King Size",
    amenities: [
      "Free Wi-Fi",
      "Room Service",
      "Air Conditioning",
      "Flat-screen TV",
      "Mini Bar",
      "Coffee Machine",
      "In-room Safe",
      "Hairdryer",
      "City View",
      "Daily Housekeeping"
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
        alt: "Deluxe Room Main View"
      },
      {
        src: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg",
        alt: "Deluxe Room - Bathroom"
      },
      {
        src: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
        alt: "Deluxe Room - City View"
      }
    ],
    longDescription: [
      "Experience comfort and style in our Deluxe Room. Designed with your relaxation in mind, this spacious accommodation offers the perfect blend of functionality and luxury.",
      "The room features a premium king-sized bed with high-quality linens, ensuring a restful sleep after a day of business or leisure activities. The large windows provide stunning city views and fill the space with natural light.",
      "The elegant bathroom includes a walk-in shower with premium bath amenities. Additional amenities include a well-stocked mini bar, coffee machine, and a flat-screen TV with international channels for your entertainment."
    ]
  };

  return <RoomDetail {...roomData} />;
};

export default DeluxeRoom;
