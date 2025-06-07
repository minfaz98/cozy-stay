
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Gallery = () => {
  // Gallery image categories
  const categories = [
    { id: "rooms", name: "Rooms & Suites" },
    { id: "dining", name: "Dining" },
    { id: "facilities", name: "Facilities" },
    { id: "exterior", name: "Exterior" }
  ];
  
  // Image data for each category
  const images = {
    rooms: [
      {
        src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Luxury Suite Bedroom",
        caption: "Luxury Suite with King Size Bed"
      },
      {
        src: "https://images.unsplash.com/photo-1631049552240-59c37f38802b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Deluxe Room",
        caption: "Deluxe Room with City View"
      },
      {
        src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Executive Suite Living Area",
        caption: "Executive Suite Living Room"
      },
      {
        src: "https://images.unsplash.com/photo-1594563703937-c6f35652284d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        alt: "Premium Bathroom",
        caption: "Marble Bathroom with Deep Soaking Tub"
      },
      {
        src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Twin Room",
        caption: "Comfortable Twin Room"
      },
      {
        src: "https://images.unsplash.com/photo-1642544546406-1a5571409836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        alt: "Suite Balcony",
        caption: "Private Balcony with Ocean View"
      },
    ],
    dining: [
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Main Restaurant",
        caption: "Our Award-Winning Restaurant"
      },
      {
        src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
        alt: "Breakfast Buffet",
        caption: "Extensive Breakfast Selection"
      },
      {
        src: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Rooftop Bar",
        caption: "Skyline Bar with City Views"
      },
      {
        src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Gourmet Dish",
        caption: "Signature Culinary Creations"
      },
      {
        src: "https://images.unsplash.com/photo-1481833761820-0509d3217039?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Private Dining Room",
        caption: "Exclusive Private Dining Experience"
      },
      {
        src: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        alt: "Dessert Selection",
        caption: "Artisanal Desserts and Pastries"
      },
    ],
    facilities: [
      {
        src: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Indoor Pool",
        caption: "Temperature-Controlled Indoor Pool"
      },
      {
        src: "https://images.unsplash.com/photo-1570799473182-36ca1dc7a30c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
        alt: "Fitness Center",
        caption: "State-of-the-Art Fitness Center"
      },
      {
        src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Spa Treatment Room",
        caption: "Luxury Spa Treatment Room"
      },
      {
        src: "https://images.unsplash.com/photo-1563200049-547264d95225?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Business Center",
        caption: "Fully Equipped Business Center"
      },
      {
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Conference Room",
        caption: "Modern Conference Facilities"
      },
      {
        src: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Yoga Studio",
        caption: "Wellness and Yoga Studio"
      },
    ],
    exterior: [
      {
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Hotel Exterior",
        caption: "Urban Red Exterior"
      },
      {
        src: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Hotel Entrance",
        caption: "Grand Hotel Entrance"
      },
      {
        src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        alt: "Hotel at Night",
        caption: "Stunning Night View"
      },
      {
        src: "https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        alt: "Garden Area",
        caption: "Landscaped Garden and Relaxation Area"
      },
      {
        src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Outdoor Pool",
        caption: "Infinity Pool with Ocean View"
      },
      {
        src: "https://images.unsplash.com/photo-1599722585837-c1cb8eea32ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Hotel Terrace",
        caption: "Outdoor Dining Terrace"
      },
    ]
  };
  
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[80vh]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-hotel mb-4">Photo Gallery</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a visual tour of our luxurious hotel, rooms, dining options, and facilities.
            </p>
          </div>
          
          <Tabs defaultValue="rooms" className="mb-16">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-sm md:text-base"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {Object.entries(images).map(([categoryId, categoryImages]) => (
              <TabsContent key={categoryId} value={categoryId}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryImages.map((image, index) => (
                    <div 
                      key={index} 
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                    >
                      <div className="h-64 overflow-hidden">
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-gray-700 font-medium">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="text-center mt-8 mb-16">
            <h2 className="text-2xl font-bold text-hotel-dark mb-4">Experience Urban Red</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
              These images are just a glimpse of what awaits you at Urban Red. 
              We invite you to experience our exceptional hospitality in person.
            </p>
            <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Hotel Panoramic View" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
