
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would send data to an API
    console.log('Form submitted:', formData);
    
    // Show success toast
    toast({
      title: "Message sent successfully",
      description: "We will get back to you shortly.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Layout>
      <div className="bg-hotel-bg py-12">
        <div className="hotel-container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">Contact Us</h1>
          <p className="text-center max-w-2xl mx-auto mb-10 text-gray-600">
            Have questions about your reservation, our facilities, or special requirements? Our team is here to help you with anything you need.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <Card className="p-6 h-full">
                <h2 className="font-display text-2xl mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 text-hotel shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600 mt-1">
                        123 Hotel Street<br />
                        City, Country<br />
                        12345
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-6 w-6 text-hotel shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600 mt-1">
                        Reservations: +1 (555) 123-4567<br />
                        Front Desk: +1 (555) 123-4568
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 text-hotel shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600 mt-1">
                        Reservations: reservations@urban.com<br />
                        Info: info@urbanhotels.com<br />
                        Support: support@urbanhotels.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-hotel shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <p className="text-gray-600 mt-1">
                        Front Desk: 24/7<br />
                        Reservations: 8:00 AM - 10:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="font-display text-2xl mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="reservation">Reservation Inquiry</option>
                        <option value="feedback">Feedback</option>
                        <option value="special-request">Special Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-hotel hover:bg-hotel-light text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
          
          {/* Map */}
          <div className="mt-12 max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-medium mb-4">Find Us</h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 w-full">
              {/* In a real application, this would be an embedded Google Map */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-medium text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "What are your check-in and check-out times?",
                  answer: "Check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability."
                },
                {
                  question: "Is breakfast included in the room rate?",
                  answer: "Breakfast inclusion depends on the rate and package you book. Please check your confirmation details or contact our reservations department."
                },
                {
                  question: "Do you offer airport transportation?",
                  answer: "Yes, we offer airport shuttle service for an additional fee. Please contact us at least 24 hours before your arrival to arrange transportation."
                },
              ].map((faq, index) => (
                <div key={index}>
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                  {index < 2 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
