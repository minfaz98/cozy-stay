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
        },
        billing: true
      }
    });

    if (!reservation) {
      throw new AppError(404, 'Reservation not found');
    }

    // Calculate total amount
    const totalAmount = reservation.totalAmount;
    const paidAmount = reservation.billing?.amount || 0;
    const remainingAmount = totalAmount - paidAmount;

    const invoice = {
      reservationId: reservation.id,
      user: reservation.user,
      room: reservation.room,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      totalAmount,
      paidAmount,
      remainingAmount,
      billing: reservation.billing
    };

    res.json({
      status: 'success',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

export const recordPayment = async (req, res, next) => {
  try {
    const validatedData = paymentSchema.parse(req.body);

    // Get reservation and check billing status
    const reservation = await prisma.reservation.findUnique({
      where: { id: validatedData.reservationId },
      include: {
        room: true,
        user: true,
        billing: true
      }
    });

    if (!reservation) {
      throw new AppError(404, 'Reservation not found');
    }

    // For company billing, create or update billing record
    if (validatedData.method === 'COMPANY_BILLING') {
      if (reservation.user.role !== 'COMPANY') {
        throw new AppError(403, 'Only travel companies can use company billing');
      }

      const billing = await prisma.billing.upsert({
        where: { reservationId: reservation.id },
        update: {
          amount: validatedData.amount,
          status: 'PENDING',
          paymentMethod: 'COMPANY_BILLING'
        },
        create: {
          reservationId: reservation.id,
          userId: reservation.userId,
          amount: validatedData.amount,
          status: 'PENDING',
          paymentMethod: 'COMPANY_BILLING'
        }
      });

      return res.status(201).json({
        status: 'success',
        data: billing
      });
    }

    // For regular payments
    const billing = await prisma.billing.create({
      data: {
        reservationId: reservation.id,
        userId: reservation.userId,
        amount: validatedData.amount,
        status: 'COMPLETED',
        paymentMethod: validatedData.method
      }
    });

    res.status(201).json({
      status: 'success',
      data: billing
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, 'Invalid payment data '+error));
    } else {
      next(error);
    }
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    const billing = await prisma.billing.findUnique({
      where: { reservationId },
      include: {
        reservation: {
          include: {
            room: true,
            user: true
          }
        }
      }
    });

    if (!billing) {
      throw new AppError(404, 'Billing record not found');
    }

    res.json({
      status: 'success',
      data: billing
    });
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId) },
      include: {
        reservation: true
      }
    });

    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }

    if (payment.status === 'REFUNDED') {
      throw new AppError(400, 'Payment is already refunded');
    }

    // Create refund record
    const refund = await prisma.payment.create({
      data: {
        reservationId: payment.reservationId,
        amount: -payment.amount, // Negative amount for refund
        method: payment.method,
        status: 'COMPLETED',
        reference: `REFUND-${payment.reference || payment.id}`,
        notes: reason
      }
    });

    // Update original payment status
    await prisma.payment.update({
      where: { id: parseInt(paymentId) },
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