import cron from 'node-cron';
import prisma from '../config/prisma.js';
import { createBilling } from '../modules/billing/billing.controller.js';
import { generateNightlyReport } from '../modules/reports/reports.controller.js';

// Run at 7 PM daily
export const scheduleAutoCancellations = () => {
  cron.schedule('0 19 * * *', async () => {
    try {
      // Find reservations without credit card details that are still pending
      const pendingReservations = await prisma.reservation.findMany({
        where: {
          status: 'PENDING',
          billing: null,
          checkIn: {
            gte: new Date()
          }
        },
        include: {
          user: true,
          room: true
        }
      });

      // Cancel these reservations
      for (const reservation of pendingReservations) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: 'CANCELLED' }
        });
      }

      // Find no-show reservations
      const noShowReservations = await prisma.reservation.findMany({
        where: {
          status: 'CONFIRMED',
          checkIn: {
            lte: new Date()
          },
          checkOut: {
            gt: new Date()
          },
          billing: null
        },
        include: {
          user: true,
          room: true
        }
      });

      // Create billing records for no-shows
      for (const reservation of noShowReservations) {
        await createBilling({
          reservationId: reservation.id,
          userId: reservation.userId,
          amount: reservation.room.price,
          status: 'PENDING',
          paymentMethod: 'CREDIT_CARD',
          type: 'NO_SHOW'
        });

        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: 'NO_SHOW' }
        });
      }

      // Generate nightly report
      await generateNightlyReport();

      console.log('Scheduled tasks completed successfully');
    } catch (error) {
      console.error('Error in scheduled tasks:', error);
    }
  });
}; 