
import React from 'react';
import RoomDetail, { RoomDetailProps } from '@/pages/RoomDetail';

const TwinRoom = () => {
  const roomData: RoomDetailProps = {
    title: "Premium Twin Room",
    description: "Comfortable room with two double beds",
    price: 129,
    capacity: 4,
    size: 450,
    bedType: "Two Double Beds",
    amenities: [
      "Free Wi-Fi",
      "Room Service",
      "Air Conditioning",
      "Flat-screen TV",
      "Mini Refrigerator",
      "Coffee Maker",
      "In-room Safe",
      "Hairdryer",
      "Bathtub",
      "Daily Housekeeping",
      "Breakfast Option"
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        alt: "Premium Twin Room Main View"
      },
      {
        src: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg",
        alt: "Premium Twin Room - Bathroom"
      }
    ],
    longDescription: [
      "Our Premium Twin Room is ideal for families or groups traveling together. With two comfortable double beds, this room can accommodate up to four guests comfortably.",
      "The spacious layout provides ample room for relaxation, work, or family time. Each bed is fitted with high-quality linens and pillows to ensure a restful night's sleep for all guests.",
      "The room includes a private bathroom with a bathtub, perfect for relaxing after a day of activities. Additional amenities include a mini refrigerator, coffee maker, and flat-screen TV with a variety of channels for your entertainment."
    ]
  };

  return <RoomDetail {...roomData} />;
};

export default TwinRoom;
