import cron from 'node-cron';
import prisma from '../config/prisma';
cron.schedule('0 0 * * *', async () => {
    const date = new Date();
    const res = await prisma.$queryRaw `
    SELECT COUNT(*) AS occupied
    FROM "Reservation" r
    WHERE r."arrivalDate" <= ${date}
    AND r."departureDate" > ${date}
    AND r."status" IN ('CONFIRMED', 'CHECKED_IN')
  `;
    console.log(`[NightlyReport] Current occupancy: ${res[0].occupied}`);
});
