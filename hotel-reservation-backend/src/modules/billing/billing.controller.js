import { z } from 'zod';
import prisma from '../../config/prisma.js';
import { AppError } from '../../middleware/error.js';
export const calculateFinalBill = async (reservationId) => {

  const paymentSchema = z.object({
 reservationId: z.string(),
 amount: z.number().positive(),
 method: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'COMPANY_BILLING']),
  reference: z.string().optional()
  });
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        room: true,
        optionalCharges: true, // Include optional charges
      },
    });

    if (!reservation) {
      throw new AppError(404, 'Reservation not found');
    }

    // Calculate room charges based on duration
    const checkInDate = new Date(reservation.checkIn);
    const checkOutDate = new Date(reservation.checkOut);
    const durationInDays = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    let roomCharges = reservation.room.price * durationInDays;

    // Add optional charges
    const optionalChargesTotal = reservation.optionalCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0
    );

    // Check for late check-out (assuming check-out time is Noon)
    const actualCheckOutTime = new Date(); // Current time
    const scheduledCheckOutTime = new Date(reservation.checkOut);
    scheduledCheckOutTime.setHours(12, 0, 0, 0); // Set scheduled checkout to 12 PM

    let lateCheckoutCharge = 0;
    if (actualCheckOutTime > scheduledCheckOutTime) {
      lateCheckoutCharge = reservation.room.price; // Charge for an additional night
    }

    const totalAmount = roomCharges + optionalChargesTotal + lateCheckoutCharge;

    return totalAmount;
  } catch (error) {
    console.error('Error calculating final bill:', error);
    throw error;
  }
};

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
        billing: true,
        optionalCharges: true // Include optional charges in invoice
      }
    });

    if (!reservation) {
      throw new AppError(404, 'Reservation not found');
    }

    const totalAmount = await calculateFinalBill(reservationId); // Calculate final amount including optional charges and late checkout
    const paidAmount = reservation.billing?.amount || 0; // Assuming a single billing record for now
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
      billing: reservation.billing,
      optionalCharges: reservation.optionalCharges // Include optional charges in invoice
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

    const billing = await prisma.billing.create({
      data: {
        reservationId: validatedData.reservationId,
        // userId is needed for the billing model but not in the paymentSchema. 
        // You might need to fetch the reservation here to get the userId
        userId: req.user.id, // Assuming user is authenticated and available in req.user
        amount: validatedData.amount,
        status: 'COMPLETED', // Assuming payment means completed billing
        paymentMethod: validatedData.method
      }
    });

    res.status(201).json({
      status: 'success',
      data: billing
    });
  } catch (error) {
    next(error);
  }
};