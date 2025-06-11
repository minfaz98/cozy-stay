import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { billingAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  reservationId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  optionalCharges?: OptionalCharge[];
  reservation?: {
    checkIn: string;
    checkOut: string;
    id: string;
    room: {
      id: string;
      price: number;
    };
  };
}

interface OptionalCharge {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
}

export default function Billing() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    if (user) {
      fetchInvoices();
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const [invoicesResponse] = await Promise.all([
        billingAPI.getInvoicesForUser(),
        billingAPI.getPaymentHistoryForUser(),
      ]);
      setInvoices(invoicesResponse.data.invoices);
    } catch (error) {
      toast.error("Failed to fetch billing data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const paymentsResponse = await billingAPI.getPaymentHistoryForUser();
      setPayments(paymentsResponse.data.payments);
    } catch (error) {
      toast.error("Failed to fetch payment history");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      await billingAPI.recordPayment({
        invoiceId: selectedInvoice,
        amount: parseFloat(paymentAmount),
        method: "CREDIT_CARD",
      });
      toast.success("Payment recorded successfully");
      fetchInvoices();
      fetchPaymentHistory();
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
      fetchPaymentHistory();
    } catch (error) {
      toast.error("Failed to process refund");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateRoomCharge = (reservation: Payment["reservation"]) => {
    if (!reservation) return 0;
    const checkInDate = new Date(reservation.checkIn);
    const days = differenceInDays(new Date(reservation.checkOut), checkInDate);
    const effectiveDays = days > 0 ? days : 1;
    return reservation.room.price * effectiveDays;
  };

  if (user?.role !== "MANAGER") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">
          Access denied. Only managers can access billing.
        </p>
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
      <h1 className="text-3xl font-bold mb-8">Billing Information</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invoices Section */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Recent invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <p className="text-center text-gray-500">No invoices found.</p>
              ) : (
                invoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    className="p-4 border rounded-lg flex justify-between items-start"
                  >
                    <div className="flex-grow">
                      <p className="font-semibold">Invoice #{invoice.id}</p>
                      <p className="text-sm text-gray-600">
                        Reservation ID: {invoice.reservationId}
                      </p>
                      <p className="text-sm">
                        Created: {formatDate(invoice.createdAt)}
                      </p>
                      {invoice.reservation && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Charges:</p>
                          <p>
                            - Room Charge: $
                            {calculateRoomCharge(invoice.reservation).toFixed(2)}
                          </p>
                          {invoice.optionalCharges &&
                            invoice.optionalCharges.map((charge) => (
                              <p key={charge.id}>
                                - {charge.description}: $
                                {charge.amount.toFixed(2)}
                              </p>
                            ))}
                        </div>
                      )}
                      <p className="text-sm font-semibold mt-2">
                        Total Amount: ${invoice.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm mt-1">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            invoice.status === "PAID"
                              ? "text-green-600"
                              : invoice.status === "PENDING"
                              ? "text-yellow-600"
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
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment History Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Recent payments and refunds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.length === 0 ? (
                <p className="text-center text-gray-500">
                  No payment history found.
                </p>
              ) : (
                payments.map((payment) => (
                  <Card
                    key={payment.id}
                    className="p-4 border rounded-lg flex justify-between items-start"
                  >
                    <div className="flex-grow">
                      <p className="font-semibold">Payment #{payment.id}</p>
                      <p className="text-sm text-gray-600">
                        Date: {formatDate(payment.createdAt)}
                      </p>
                      <p className="text-sm">
                        Amount: ${payment.amount.toFixed(2)}
                      </p>
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
                        className="ml-4"
                      >
                        Refund
                      </Button>
                    )}
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Process Payment for Invoice #{selectedInvoice}
            </DialogTitle>
            <DialogDescription>
              Enter payment details to process the invoice.
            </DialogDescription>
          </DialogHeader>
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedInvoice(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Process Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
