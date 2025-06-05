
import React from 'react';
import Layout from '@/components/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const FAQs = () => {
  // FAQ categories
  const faqCategories = [
    {
      category: "Reservations & Bookings",
      questions: [
        {
          question: "How can I make a reservation?",
          answer: "You can make a reservation through our website, by calling our reservation desk at +1-555-123-4567, or by using third-party booking platforms. For the best rates and benefits, we recommend booking directly through our website or contacting us directly."
        },
        {
          question: "What is your cancellation policy?",
          answer: "Our standard cancellation policy allows free cancellation up to 48 hours before check-in. Cancellations made within 48 hours of arrival may be subject to a one-night charge. Special rates or promotions might have different cancellation terms, which will be clearly stated at the time of booking."
        },
        {
          question: "Do you require a deposit for reservations?",
          answer: "For standard reservations, we typically require a credit card to guarantee your booking without an upfront deposit. However, for peak seasons, special events, or long-stay bookings, we might require a deposit of one night's stay. Group bookings and special packages may have different deposit requirements."
        },
        {
          question: "Can I modify my reservation after it's confirmed?",
          answer: "Yes, you can modify your reservation subject to availability. Changes to dates, room types, or length of stay can be made by contacting our reservation team. Please note that modifications may lead to rate changes, especially during peak seasons or if promotional rates are no longer available."
        },
        {
          question: "What happens if I don't show up for my reservation?",
          answer: "No-show reservations without prior cancellation will be charged for the first night's stay. If the reservation was made without credit card details, it will be automatically cancelled at 7 PM on the arrival day."
        }
      ]
    },
    {
      category: "Check-In & Check-Out",
      questions: [
        {
          question: "What are your check-in and check-out times?",
          answer: "Standard check-in time is from 3:00 PM, and check-out is by 12:00 PM (noon). Early check-in and late check-out may be available upon request, subject to availability and possibly an additional fee."
        },
        {
          question: "Can I request an early check-in or late check-out?",
          answer: "Yes, we're happy to accommodate early check-ins and late check-outs when possible. Early check-ins before 1:00 PM and late check-outs until 3:00 PM may incur a fee of 50% of the daily rate. Late check-outs beyond 3:00 PM will be charged a full night's stay. These arrangements should be requested in advance."
        },
        {
          question: "What identification is required at check-in?",
          answer: "All guests must present a valid government-issued photo ID (passport, driver's license, or national ID card) at check-in. The name on the ID must match the name on the reservation. For international guests, passports are preferred."
        },
        {
          question: "Do you charge a security deposit at check-in?",
          answer: "We place a hold on your credit card at check-in to cover incidentals. The amount varies based on your length of stay and room type, typically ranging from $50 to $200 per night. This hold is released upon check-out after confirming no additional charges or damages."
        },
        {
          question: "What happens if I need to check out after the designated time?",
          answer: "If you check out after 12:00 PM without prior arrangement, a late check-out fee applies. After 3:00 PM, you'll be charged for an additional night. Please notify the front desk if you need to extend your stay beyond the scheduled check-out time."
        }
      ]
    },
    {
      category: "Rooms & Amenities",
      questions: [
        {
          question: "Do all rooms have free Wi-Fi?",
          answer: "Yes, complimentary high-speed Wi-Fi is available in all guest rooms and public areas throughout the hotel. Premium high-bandwidth Wi-Fi is also available for an additional fee for guests requiring enhanced connectivity for video conferencing or streaming."
        },
        {
          question: "What types of rooms do you offer?",
          answer: "We offer a variety of accommodations including Standard Rooms, Deluxe Rooms, Executive Suites, Twin Rooms, and Luxury Suites. We also have residential suites available for weekly or monthly stays at special rates. Each room type offers different amenities and views, and we're happy to help you choose the best option for your needs."
        },
        {
          question: "Do you have accessible rooms for guests with disabilities?",
          answer: "Yes, we have specially designed accessible rooms that comply with ADA standards. These rooms feature wider doorways, grab bars in bathrooms, lower closet rods, and other accessibility features. Please specify your requirements when booking so we can assign the most suitable room."
        },
        {
          question: "What amenities are included in the room rate?",
          answer: "Standard amenities include Wi-Fi, access to fitness and business centers, in-room coffee and tea facilities, and basic toiletries. Depending on your room type and any packages selected, additional amenities may include breakfast, spa credits, or executive lounge access."
        },
        {
          question: "Can I request a specific room or floor?",
          answer: "We're happy to note your room preferences in your reservation, including floor level, proximity to elevators, or specific views. While we cannot guarantee specific room numbers, we do our best to accommodate preferences based on availability at the time of check-in."
        }
      ]
    },
    {
      category: "Payment & Billing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), cash, and mobile payment options like Apple Pay and Google Pay. Corporate clients may arrange for direct billing with prior approval. Cryptocurrency payments are not currently accepted."
        },
        {
          question: "When will my credit card be charged?",
          answer: "For most reservations, we place a hold on your card at the time of booking but don't charge it until check-in. For non-refundable rates or certain promotions, your card may be charged at the time of booking. All incidental charges are settled upon check-out."
        },
        {
          question: "Do you provide itemized billing for my stay?",
          answer: "Yes, at check-out you'll receive a detailed invoice listing all charges including room rates, taxes, and any additional services used during your stay. We can email a copy of your invoice if preferred, and receipts for individual services can also be provided upon request."
        },
        {
          question: "Are there any additional taxes or fees not included in the room rate?",
          answer: "Yes, room rates are subject to local taxes (currently 12.5%) and a resort fee of $25 per night that covers amenities such as Wi-Fi, fitness center access, and local calls. These charges are clearly indicated during the booking process and on your final bill."
        },
        {
          question: "How are no-show charges handled?",
          answer: "If you don't arrive for your reservation without canceling in advance, your credit card will be charged for one night's stay plus applicable taxes. For reservations without credit card information, no charges apply, but the reservation is automatically cancelled at 7 PM on the arrival day."
        }
      ]
    },
    {
      category: "Hotel Services & Facilities",
      questions: [
        {
          question: "What dining options are available at the hotel?",
          answer: "Our hotel features a main restaurant serving breakfast, lunch, and dinner with international and local cuisine. We also have a rooftop bar, café, and 24-hour room service. Special dietary requirements can be accommodated with advance notice."
        },
        {
          question: "Do you offer airport transportation?",
          answer: "Yes, we provide airport shuttle service for an additional fee. The service must be booked at least 24 hours in advance. Private car services can also be arranged through our concierge for a more personalized experience."
        },
        {
          question: "Is parking available on-site?",
          answer: "Yes, we offer both self-parking and valet services. Self-parking costs $20 per day, while valet parking is $30 per day with in-and-out privileges. Electric vehicle charging stations are available in our garage for a small additional fee."
        },
        {
          question: "What business services are available?",
          answer: "Our business center provides computers, printing, copying, and scanning services. Meeting rooms can be reserved in advance, and we offer video conferencing equipment, audiovisual support, and secretarial services upon request."
        },
        {
          question: "Are pets allowed in the hotel?",
          answer: "Yes, we are a pet-friendly hotel welcoming dogs and cats under 30 pounds. There is a non-refundable pet fee of $75 per stay. Pet amenities including beds, bowls, and treats are provided. Please notify us in advance if you'll be traveling with a pet."
        }
      ]
    }
  ];
  
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[80vh]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-hotel mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to the most common questions about our hotel, services, and policies.
            </p>
          </div>
          
          <div className="space-y-10 mb-16">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-bold p-6 bg-hotel text-white">
                  {category.category}
                </h2>
                <div className="p-6">
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`} className="border border-gray-200 rounded-md overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-hotel-dark font-medium text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 bg-gray-50 text-gray-700">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-hotel-dark text-white rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-4">Didn't Find What You're Looking For?</h2>
            <p className="mb-6">
              Our guest services team is always ready to help with any additional questions or special requests you might have.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-md backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Call Us</h3>
                </div>
                <p className="mb-4 text-white/70">Our team is available 24/7 to assist you with any inquiries.</p>
                <Button variant="outline" className="w-full bg-transparent hover:bg-white hover:text-hotel-dark transition-colors border-white text-white">
                  +1-555-123-4567
                </Button>
              </div>
              
              <div className="bg-white/10 p-6 rounded-md backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Email Us</h3>
                </div>
                <p className="mb-4 text-white/70">Send us your questions and we'll get back to you promptly.</p>
                <Button variant="outline" asChild className="w-full bg-transparent hover:bg-white hover:text-hotel-dark transition-colors border-white text-white">
                  <Link to="/contact">Contact Form</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-hotel-dark mb-4">Reservation Policies</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-hotel mb-2">Guaranteed Reservations</h3>
                <p className="text-gray-700">
                  All reservations must be guaranteed with a valid credit card. Without a credit card guarantee, 
                  reservations will be held until 7:00 PM on the day of arrival.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-hotel mb-2">Group Bookings</h3>
                <p className="text-gray-700">
                  For bookings of 3 or more rooms, please contact our group reservations department for special rates 
                  and terms. Travel companies can arrange block bookings at discounted rates.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-hotel mb-2">Extended Stays</h3>
                <p className="text-gray-700">
                  For stays longer than 7 days, we offer weekly rates and monthly rates for our residential suites. 
                  Long-term guests enjoy additional amenities and services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-hotel mb-2">Special Requests</h3>
                <p className="text-gray-700">
                  We're happy to accommodate special requests such as connecting rooms, specific floor preferences, 
                  or bed type requests. These are subject to availability and cannot be guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQs;
