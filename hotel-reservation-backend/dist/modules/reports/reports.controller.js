import prisma from '../../config/prisma';
import { startOfDay, endOfDay } from 'date-fns';
export const occupancyReport = async (req, res) => {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const occupied = await prisma.reservation.count({
        where: {
            arrivalDate: { lte: endOfDay(date) },
            departureDate: { gt: startOfDay(date) },
            status: 'CHECKED_IN'
        }
    });
    res.json({ date, occupied });
};
