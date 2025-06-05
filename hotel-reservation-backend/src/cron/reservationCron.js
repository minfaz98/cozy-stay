import cron from 'node-cron';
import { cancelPendingReservations } from '../modules/reservations/reservations.controller.js';

// Run every minute to check for reservations that need to be cancelled
const initReservationCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await cancelPendingReservations();
    } catch (error) {
      console.error('Error in reservation cron job:', error);
    }
  });
};

export default initReservationCron; 