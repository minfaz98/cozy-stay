import cron from 'node-cron';
import prisma from '../config/prisma.js';

cron.schedule('0 19 * * *', async () => {
  const cancelled = await prisma.reservation.updateMany({
    where: { 
      guaranteeCC: false, 
      status: 'PENDING' 
    },
    data: { status: 'CANCELLED' }
  });
  console.log(`[AutoCancel] Cancelled ${cancelled.count} reservations without CC`);
}); 