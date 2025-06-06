import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { billingAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
  type: string;
}

interface Invoice {
  id: string;
  bookingId: string;
  totalAmount: number;
  status: string;
  dueDate: string;
}

export default function Billing() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "MANAGER") {
      fetchBillingData();
    }
  }, [user]);

  const fetchBillingData = async () => {
    try {
      // In a real app, you would fetch this data based on the current user's bookings
      const [paymentsResponse, invoicesResponse] = await Promise.all([
        billingAPI.getPaymentHistory("current"),
        billingAPI.generateInvoice("current"),
      ]);
      setPayments(paymentsResponse.data);
      setInvoices(invoicesResponse.data);
    } catch (error) {
      toast.error("Failed to fetch billing data");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      await billingAPI.recordPayment({
        invoiceId: selectedInvoice,
        amount: parseFloat(paymentAmount),
        type: "CREDIT_CARD",
      });
      toast.success("Payment recorded successfully");
      fetchBillingData();
      setSelectedInvoice(null);
      setPaymentAmount("");
    } catch (error) {
      toast.error("Failed to record payment");
    }
  };

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm("Are you sure you want to process this refund?")) return;

    try {
      await billingAPI.refundPayment(paymentId, "Customer request");
      toast.success("Refund processed successfully");
      fetchBillingData();
    } catch (error) {
      toast.error("Failed to process refund");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (user?.role !== "MANAGER") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Access denied. Only managers can access billing.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Recent invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">Invoice #{invoice.id}</p>
                    <p className="text-sm text-gray-600">
                      Due: {formatDate(invoice.dueDate)}
                    </p>
                    <p className="text-sm">Amount: ${invoice.totalAmount}</p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          invoice.status === "PAID"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </p>
                  </div>
                  {invoice.status !== "PAID" && (
                    <Button
                      onClick={() => setSelectedInvoice(invoice.id)}
                      variant="outline"
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Recent payments and refunds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">Payment #{payment.id}</p>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(payment.date)}
                    </p>
                    <p className="text-sm">Amount: ${payment.amount}</p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          payment.status === "COMPLETED"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </p>
                  </div>
                  {payment.status === "COMPLETED" && (
                    <Button
                      onClick={() => handleRefund(payment.id)}
                      variant="destructive"
                    >
                      Refund
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedInvoice && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
            <CardDescription>Enter payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Process Payment</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 