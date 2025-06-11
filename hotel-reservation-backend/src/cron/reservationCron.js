import cron from 'node-cron';
import { cancelPendingReservations } from '../modules/reservations/reservations.controller.js';
import prisma from '../config/prisma.js';

const initReservationCron = () => {
  // Schedule the job to run daily at 7:00 PM
  cron.schedule('0 19 * * *', async () => {
    try {
      console.log('Running daily reservation cron job...');
      // 1. Cancel pending reservations created before 7 PM
      await cancelPendingReservations();

      // 2. Identify reservations with a "NO_SHOW" status and create billing records
      const noShowReservations = await prisma.reservation.findMany({
        where: {
          status: 'NO_SHOW',
          billing: null, // Only process reservations that don't have a billing record yet
        },
      });

      for (const reservation of noShowReservations) {
        await prisma.billing.create({
          data: {
            reservationId: reservation.id,
            userId: reservation.userId,
            amount: reservation.totalAmount,
            status: 'NO_SHOW', // Or a more appropriate status like 'UNPAID'
            paymentMethod: 'NA', // As it's a no-show bill
          },
        });
      }
      console.log('Daily reservation cron job finished.');
    } catch (error) {
      console.error('Error in reservation cron job:', error);
    }
  });
};

export default initReservationCron; 