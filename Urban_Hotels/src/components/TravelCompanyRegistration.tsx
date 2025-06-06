import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TravelCompanyRegistrationProps {
  onComplete: (data: any) => void;
}

export default function TravelCompanyRegistration({ onComplete }) {
  const { toast } = useToast();
  const [isTravelCompany, setIsTravelCompany] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyRegistrationNumber: '',
    taxId: '',
    billingAddress: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTravelCompany) {
      onComplete(null);
      return;
    }

    // Validate required fields
    const requiredFields = ['companyName', 'companyRegistrationNumber', 'taxId', 'billingAddress'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`
      });
      return;
    }

    onComplete({
      ...formData,
      isTravelCompany: true
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Travel Company Registration</CardTitle>
        <CardDescription>
          Are you registering as a travel company? This will enable you to make bulk bookings at discounted rates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isTravelCompany"
              checked={isTravelCompany}
              onCheckedChange={(checked) => setIsTravelCompany(checked as boolean)}
            />
            <Label htmlFor="isTravelCompany">I am registering as a travel company</Label>
          </div>

          {isTravelCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyRegistrationNumber">Registration Number *</Label>
                  <Input
                    id="companyRegistrationNumber"
                    name="companyRegistrationNumber"
                    value={formData.companyRegistrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID *</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address *</Label>
                  <Input
                    id="billingAddress"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            {isTravelCompany ? 'Complete Registration' : 'Continue as Regular User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 