import cron from 'node-cron';
import prisma from '../config/prisma.js';
// Assuming createBilling is correctly imported and structured to accept an object as arguments
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
        // Assuming createBilling is designed to be called internally with a direct object
        // and handles the Prisma creation. If it relies on express req/res, this needs
        // to be adapted or a dedicated internal billing function should be used.
        await createBilling({
 'body': { // Wrap in 'body' if createBilling expects req.body
 reservationId: reservation.id,
 userId: reservation.userId,
 amount: reservation.room.price, // Or calculate based on policy
 status: 'PENDING',
 paymentMethod: reservation.creditCard ? 'CREDIT_CARD' : 'NA', // Use provided card or NA
 type: 'NO_SHOW'
          }
 });
        // Update reservation status to NO_SHOW after creating billing
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

// Schedule nightly report generation after 7 PM
// Runs daily at 7:05 PM (5 minutes after auto-cancellations and no-show billing)
cron.schedule('5 19 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today7PM = new Date();
    today7PM.setHours(19, 0, 0, 0);

    // Calculate occupancy (Checked out or No Show for the previous night)
    const occupancyCount = await prisma.reservation.count({
      where: {
        status: { in: ['CHECKED_OUT', 'NO_SHOW'] },
        checkOut: {
          gte: yesterday,
          lt: today7PM // Up to 7 PM today covers last night's checkouts/no-shows
        }
      }
    });

    console.log(`Previous night's occupancy: ${occupancyCount}`);
  } catch (error) {
    console.error('Error generating nightly occupancy report:', error);
  }
});