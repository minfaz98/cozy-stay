
import React from 'react';
import RoomDetail, { RoomDetailProps } from '@/pages/RoomDetail';

const ExecutiveSuite = () => {
  const roomData: RoomDetailProps = {
    title: "Executive Suite",
    description: "Luxury suite with separate living area and premium amenities",
    price: 249,
    capacity: 2,
    size: 600,
    bedType: "King Size",
    amenities: [
      "Free Wi-Fi",
      "Room Service",
      "Air Conditioning",
      "Separate Living Area",
      "Flat-screen TVs",
      "Premium Mini Bar",
      "Espresso Machine",
      "In-room Safe",
      "Luxury Bath Amenities",
      "Bathtub and Walk-in Shower",
      "Hairdryer",
      "Ocean View",
      "Daily Housekeeping",
      "Evening Turndown Service",
      "Complimentary Breakfast",
      "Access to Executive Lounge"
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/7534561/pexels-photo-7534561.jpeg",
        alt: "Executive Suite Main View"
      },
      {
        src: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
        alt: "Executive Suite - Living Area"
      },
      {
        src: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg",
        alt: "Executive Suite - Bedroom"
      },
      {
        src: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg",
        alt: "Executive Suite - Bathroom"
      }
    ],
    longDescription: [
      "Indulge in luxury with our Executive Suite, designed for the discerning business traveler or those seeking extra space and comfort. This premium accommodation offers a separate living area and bedroom for added privacy and convenience.",
      "The spacious bedroom features a plush king-sized bed with premium linens, while the living area includes a comfortable sofa, work desk, and additional flat-screen TV. Large windows provide stunning ocean views from every angle.",
      "Enjoy exclusive amenities including a premium mini bar, espresso machine, and luxury bath products. Executive Suite guests also receive complimentary breakfast and access to our Executive Lounge where refreshments are served throughout the day.",
      "The marble bathroom features both a deep soaking bathtub and separate walk-in shower, complete with plush robes and slippers for your comfort."
    ]
  };

  return <RoomDetail {...roomData} />;
};

export default ExecutiveSuite;
