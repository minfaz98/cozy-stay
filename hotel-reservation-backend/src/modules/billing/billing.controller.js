import { z } from 'zod';
import prisma from '../../config/prisma.js';
import { AppError } from '../../middleware/error.js';

const paymentSchema = z.object({
  reservationId: z.string(),
  amount: z.number().positive(),
  method: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'COMPANY_BILLING']),
  reference: z.string().optional()
});

export const generateInvoice = async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    // Fetch reservation with room and user info (excluding billing here)
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!reservation) {
      throw new AppError(404, 'Reservation not found');
    }

    // Fetch all billing records (payments + invoices) for this reservation
    const billingRecords = await prisma.billing.findMany({
      where: { reservationId },
      orderBy: { createdAt: 'asc' }
    });

    // Calculate paid amount by summing all 'COMPLETED' billing amounts
    const paidAmount = billingRecords
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.amount, 0);

    const totalAmount = reservation.totalAmount;
    const remainingAmount = totalAmount - paidAmount;

    // Find invoice record: usually the one with status 'PENDING'
    // If no invoice found, create one with 'PENDING' status
    let invoice = billingRecords.find(b => b.status === 'PENDING');

    if (!invoice) {
      invoice = await prisma.billing.create({
        data: {
          reservationId,
          userId: reservation.userId,
          amount: totalAmount,
          status: 'PENDING',
          paymentMethod: 'CASH', // default or your business logic
        }
      });
    }

    // Prepare response data
    const invoiceData = {
      reservationId,
      user: reservation.user,
      room: reservation.room,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      totalAmount,
      paidAmount,
      remainingAmount,
      invoice,
      payments: billingRecords.filter(b => b.status === 'COMPLETED' || b.status === 'REFUNDED'),
    };

    res.json({
      status: 'success',
      data: invoiceData
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    next(error);
  }
};


export const recordPayment = async (req, res, next) => {
  try {
    const validatedData = paymentSchema.parse(req.body);

    const reservation = await prisma.reservation.findUnique({
      where: { id: validatedData.reservationId },
      include: { user: true }
    });

    if (!reservation) {
      throw new AppError(404, 'Reservation not found');
    }

    // For COMPANY_BILLING method, add any role checks here if needed

    const payment = await prisma.billing.create({
      data: {
        reservationId: reservation.id,
        userId: reservation.userId,
        amount: validatedData.amount,
        status: 'COMPLETED',
        paymentMethod: validatedData.method,
        reference: validatedData.reference || null,
        notes: null
      }
    });

    res.status(201).json({
      status: 'success',
      data: payment
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, 'Invalid payment data'));
    } else {
      next(error);
    }
  }
};


export const getPaymentHistory = async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    const billingRecords = await prisma.billing.findMany({
      where: { reservationId },
      orderBy: { createdAt: 'asc' }
    });

    if (billingRecords.length === 0) {
      throw new AppError(404, 'No billing records found');
    }

    res.json({
      status: 'success',
      data: billingRecords
    });
  } catch (error) {
    next(error);
  }
};


export const refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await prisma.billing.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }

    if (payment.status === 'REFUNDED') {
      throw new AppError(400, 'Payment is already refunded');
    }

    if (payment.amount <= 0) {
      throw new AppError(400, 'Cannot refund a non-positive payment record');
    }

    const refund = await prisma.billing.create({
      data: {
        reservationId: payment.reservationId,
        userId: payment.userId,
        amount: -payment.amount,
        status: 'COMPLETED',
        paymentMethod: payment.paymentMethod,
        reference: `REFUND-${payment.reference || payment.id}`,
        notes: reason || null
      }
    });

    await prisma.billing.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' }
    });

    res.json({
      status: 'success',
      data: refund
    });
  } catch (error) {
    next(error);
  }
};

