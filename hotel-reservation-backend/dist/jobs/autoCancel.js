import cron from 'node-cron';
import prisma from '../config/prisma';
import { ResStatus } from '@prisma/client';
cron.schedule('0 19 * * *', async () => {
    const cancelled = await prisma.reservation.updateMany({
        where: { guaranteeCC: false, status: ResStatus.PENDING },
        data: { status: ResStatus.CANCELLED }
    });
    console.log(`[AutoCancel] Cancelled ${cancelled.count} reservations without CC`);
});
