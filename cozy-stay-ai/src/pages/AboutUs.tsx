
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel, Users, Clock, MapPin } from 'lucide-react';
import minfazImg from '@/assets/minfaz.jpg';
import pic1Img from '@/assets/pic1.png';
import pic2Img from '@/assets/pic2.png';

const AboutUs = () => {
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[80vh]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-hotel mb-4">About CozyStay</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our story, our mission, and the passion that drives us to provide exceptional hospitality experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-hotel-dark">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 1998, CozyStay began with a simple vision: to create a home away from home for travelers. 
                What started as a small family-run hotel has now grown into a beloved destination for thousands of guests each year.
              </p>
              <p className="text-gray-700">
                Our philosophy remains unchanged: we believe in personalized service, attention to detail, and creating 
                memorable experiences. Every room, every meal, and every interaction is designed with our guests' comfort in mind.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Hotel exterior" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div className="md:order-2">
              <h2 className="text-2xl font-bold mb-4 text-hotel-dark">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                At CozyStay, our mission is to provide exceptional hospitality that exceeds expectations. 
                We strive to create a welcoming environment where every guest feels valued and cared for.
              </p>
              <p className="text-gray-700">
                We are committed to sustainability, community engagement, and continuous improvement. 
                By investing in our people, our property, and our practices, we aim to set new standards 
                in the hospitality industry while preserving the personal touch that makes us unique.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                alt="Hotel lobby" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-hotel-light rounded-full">
                    <Hotel className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-hotel-dark">Luxury Experience</h3>
                <p className="text-gray-700">
                  Experience unparalleled comfort in our meticulously designed rooms and suites.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-hotel-light rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-hotel-dark">Dedicated Team</h3>
                <p className="text-gray-700">
                  Our professional staff is committed to making your stay exceptional.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-hotel-light rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-hotel-dark">24/7 Service</h3>
                <p className="text-gray-700">
                  Round-the-clock assistance to meet all your needs whenever you need it.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-hotel-light rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-hotel-dark">Prime Location</h3>
                <p className="text-gray-700">
                  Strategically located with easy access to key attractions and business centers.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-hotel-dark text-white p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-200">
                  We pursue excellence in all aspects of our service, from the smallest details to the grandest experiences.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                <p className="text-gray-200">
                  We operate with honesty, transparency, and strong ethical principles in all our interactions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-200">
                  We continuously evolve and adapt to enhance the guest experience through creative solutions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center text-hotel-dark">Meet Our Leadership</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Mohammed Minfaz",
                  title: "General Manager",
                  bio: "With over 15 years of hospitality experience, Minfaz brings vision and leadership to CozyStay.",
                  image: minfazImg
                },
                {
                  name: "Tharaka",
                  title: "Operations Director",
                  bio: "Tharaka ensures smooth daily operations and consistently delivers exceptional guest experiences.",
                  image: pic2Img
                },
                {
                  name: "Thanuj",
                  title: "Guest Relations Manager",
                  bio: "Thanuj specializes in creating personalized experiences that keep guests coming back.",
                  image: pic1Img
                },
                {
                  name: "yumeth",
                  title: "Guest Relations Manager",
                  bio: "yumeth specializes in creating personalized experiences that keep guests coming back.",
                  // image: pic1Img
                }
              ].map((person, index) => (
                <div key={index} className="text-center">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                    <img 
                      src={person.image} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-hotel">{person.name}</h3>
                  <p className="text-gray-500 mb-2">{person.title}</p>
                  <p className="text-gray-700">{person.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
