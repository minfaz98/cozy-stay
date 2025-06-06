
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Hotel, Bed, Calendar, Home, Info, Mail, 
  Phone, CreditCard, Users, Settings, 
  Bell, FileText
} from 'lucide-react';

const Amenities = () => {
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[80vh]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-hotel mb-4">Hotel Amenities</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience luxury and comfort with our extensive range of premium amenities designed to make your stay exceptional.
            </p>
          </div>

          <Tabs defaultValue="room" className="mb-16">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="room" className="text-sm md:text-base">Room Amenities</TabsTrigger>
              <TabsTrigger value="dining" className="text-sm md:text-base">Dining</TabsTrigger>
              <TabsTrigger value="wellness" className="text-sm md:text-base">Wellness</TabsTrigger>
              <TabsTrigger value="services" className="text-sm md:text-base">Services</TabsTrigger>
            </TabsList>
            
            <TabsContent value="room" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Luxury Bedding" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">Luxury Bedding</h3>
                    <p className="text-gray-700">
                      Experience unparalleled comfort with our premium bedding featuring high thread count Egyptian cotton sheets, 
                      plush pillows, and custom duvets designed for the perfect night's sleep.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Smart Room Controls" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">Smart Room Controls</h3>
                    <p className="text-gray-700">
                      Control your room environment with our state-of-the-art smart systems. Adjust lighting, 
                      temperature, entertainment, and more with simple touch controls or voice commands.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-hotel-dark mb-4">All Room Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "High-speed WiFi",
                    "4K Smart TV",
                    "Premium toiletries",
                    "Mini bar",
                    "In-room safe",
                    "Coffee & tea facilities",
                    "USB charging ports",
                    "Bluetooth speakers",
                    "Plush bathrobes",
                    "Luxury slippers",
                    "Pillow menu",
                    "Blackout curtains"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-hotel-accent rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dining" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Fine Dining Restaurant" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">Gourmet Restaurant</h3>
                    <p className="text-gray-700">
                      Our award-winning restaurant offers an exquisite menu crafted by renowned chefs, featuring 
                      local and international cuisine prepared with the freshest seasonal ingredients.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Rooftop Bar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">Skyline Bar</h3>
                    <p className="text-gray-700">
                      Enjoy craft cocktails, fine wines, and premium spirits at our elegant bar with breathtaking 
                      city views. Perfect for both relaxed evenings and special celebrations.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-hotel-dark mb-4">Dining Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-hotel-accent rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-hotel-dark">24/7 Room Service</span>
                      <p className="text-gray-700 text-sm">Enjoy our restaurant menu from the comfort of your room any time</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-hotel-accent rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-hotel-dark">Breakfast Buffet</span>
                      <p className="text-gray-700 text-sm">Start your day with our extensive breakfast selection</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-hotel-accent rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-hotel-dark">Café & Pastry Shop</span>
                      <p className="text-gray-700 text-sm">Fresh pastries, specialty coffees, and light snacks</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-hotel-accent rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-hotel-dark">Private Dining</span>
                      <p className="text-gray-700 text-sm">Exclusive spaces for special occasions and meetings</p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="wellness" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Spa Services" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">Luxury Spa</h3>
                    <p className="text-gray-700">
                      Indulge in rejuvenating treatments at our spa sanctuary. From massages to facials, 
                      our therapists use premium products and techniques to enhance your wellbeing.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1570799473182-36ca1dc7a30c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80" 
                      alt="Fitness Center" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">State-of-the-Art Fitness Center</h3>
                    <p className="text-gray-700">
                      Maintain your fitness routine with our modern gym equipment, personal training sessions, 
                      and a variety of fitness classes available throughout your stay.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1519315901367-f34ff9154487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Swimming Pool" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">Indoor & Outdoor Pools</h3>
                    <p className="text-gray-700">
                      Enjoy a refreshing swim in our temperature-controlled pools. Lounge by the poolside 
                      with our attentive service providing refreshments and light meals.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Wellness Classes" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hotel-dark mb-2">Wellness Programs</h3>
                    <p className="text-gray-700">
                      Participate in yoga, meditation, and wellness workshops led by expert instructors. 
                      Personalized wellness journeys available upon request.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-hotel-light rounded-full">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-hotel-dark">Concierge Services</h3>
                    <p className="text-gray-700">
                      Our knowledgeable concierge is available to assist with tour bookings, restaurant reservations, and local recommendations.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-hotel-light rounded-full">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-hotel-dark">Event Planning</h3>
                    <p className="text-gray-700">
                      Professional planning for weddings, meetings, and special events with customized catering options.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-hotel-light rounded-full">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-hotel-dark">Business Center</h3>
                    <p className="text-gray-700">
                      Fully equipped business facilities with high-speed internet, printing services, and private meeting rooms.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-hotel-light rounded-full">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-hotel-dark">Currency Exchange</h3>
                    <p className="text-gray-700">
                      Convenient currency exchange services available at the front desk for international guests.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-hotel-light rounded-full">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-hotel-dark">Airport Transfers</h3>
                    <p className="text-gray-700">
                      Luxury transportation to and from the airport, with options for private or shared services.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-hotel-light rounded-full">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-hotel-dark">Laundry Service</h3>
                    <p className="text-gray-700">
                      Express laundry and dry cleaning with same-day service available for guest convenience.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-hotel-dark text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Premium Services</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-hotel-accent rounded-full"></div>
                      <span>Private butler service for suite guests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-hotel-accent rounded-full"></div>
                      <span>Personalized shopping assistance and personal shoppers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-hotel-accent rounded-full"></div>
                      <span>In-room private chef experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-hotel-accent rounded-full"></div>
                      <span>VIP access to local attractions and events</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-hotel-accent rounded-full"></div>
                      <span>Childcare and pet care services</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Amenities;
