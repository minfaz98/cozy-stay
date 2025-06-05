import { z } from 'zod';
import prisma from '../../config/prisma.js';
import { AppError } from '../../middleware/error.js';

export const getOccupancyReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError(400, 'Start date and end date are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get total rooms
    const totalRooms = await prisma.room.count();

    // Get occupied rooms for each day in the range
    const occupiedRooms = await prisma.reservation.findMany({
      where: {
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        OR: [
          {
            checkIn: { lte: end },
            checkOut: { gte: start }
          }
        ]
      },
      include: {
        room: true
      }
    });

    // Calculate occupancy for each day
    const occupancyByDay = {};
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const occupiedCount = occupiedRooms.filter(reservation => {
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);
        return currentDate >= checkIn && currentDate < checkOut;
      }).length;

      occupancyByDay[dateStr] = {
        occupied: occupiedCount,
        total: totalRooms,
        occupancyRate: (occupiedCount / totalRooms) * 100
      };

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate statistics
    const occupancyRates = Object.values(occupancyByDay).map(day => day.occupancyRate);
    const averageOccupancy = occupancyRates.reduce((a, b) => a + b, 0) / occupancyRates.length;
    const peakOccupancy = Math.max(...occupancyRates);
    const lowestOccupancy = Math.min(...occupancyRates);

    // Get current occupancy
    const currentOccupied = occupiedRooms.filter(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const now = new Date();
      return now >= checkIn && now < checkOut;
    }).length;

    res.json({
      status: 'success',
      data: {
        currentOccupancy: (currentOccupied / totalRooms) * 100,
        occupiedRooms: currentOccupied,
        totalRooms,
        averageOccupancy,
        peakOccupancy,
        lowestOccupancy,
        occupancyByDay,
        trend: Object.entries(occupancyByDay).map(([date, data]) => ({
          date,
          occupancy: data.occupancyRate
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError(400, 'Start date and end date are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all payments in the date range
    const payments = await prisma.billing.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        },
        status: 'COMPLETED'
      },
      include: {
        reservation: {
          include: {
            room: true
          }
        }
      }
    });

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate revenue by room type
    const revenueByRoomType = {};
    payments.forEach(payment => {
      const roomType = payment.reservation.room.type;
      if (!revenueByRoomType[roomType]) {
        revenueByRoomType[roomType] = 0;
      }
      revenueByRoomType[roomType] += payment.amount;
    });

    // Calculate revenue by day
    const revenueByDay = {};
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate.toISOString().split('T')[0] === dateStr;
      });

      revenueByDay[dateStr] = dayPayments.reduce((sum, payment) => sum + payment.amount, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate average daily revenue
    const dailyRevenues = Object.values(revenueByDay);
    const averageDailyRevenue = dailyRevenues.reduce((a, b) => a + b, 0) / dailyRevenues.length;

    // Calculate room revenue vs additional revenue
    const roomRevenue = payments
      .filter(payment => payment.reservation)
      .reduce((sum, payment) => sum + payment.amount, 0);

    const additionalRevenue = payments
      .filter(payment => !payment.reservation)
      .reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      status: 'success',
      data: {
        totalRevenue,
        averageDailyRevenue,
        roomRevenue,
        additionalRevenue,
        revenueByRoomType,
        revenueByDay,
        breakdown: Object.entries(revenueByRoomType).map(([type, amount]) => ({
          category: type,
          amount
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectionsReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError(400, 'Start date and end date are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get historical occupancy data for the same period last year
    const lastYearStart = new Date(start);
    lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
    const lastYearEnd = new Date(end);
    lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);

    const historicalOccupancy = await prisma.reservation.findMany({
      where: {
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        OR: [
          {
            checkIn: { lte: lastYearEnd },
            checkOut: { gte: lastYearStart }
          }
        ]
      }
    });

    // Get current bookings for the future period
    const currentBookings = await prisma.reservation.findMany({
      where: {
        status: { in: ['CONFIRMED'] },
        OR: [
          {
            checkIn: { lte: end },
            checkOut: { gte: start }
          }
        ]
      }
    });

    // Calculate projections based on historical data and current bookings
    const projections = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Get historical occupancy for this date last year
      const lastYearDate = new Date(currentDate);
      lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
      const lastYearOccupancy = historicalOccupancy.filter(reservation => {
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);
        return lastYearDate >= checkIn && lastYearDate < checkOut;
      }).length;

      // Get current bookings for this date
      const currentOccupancy = currentBookings.filter(reservation => {
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);
        return currentDate >= checkIn && currentDate < checkOut;
      }).length;

      // Project future occupancy based on historical data and current bookings
      const projectedOccupancy = Math.max(
        currentOccupancy,
        Math.round(lastYearOccupancy * 1.1) // Assume 10% growth
      );

      projections.push({
        date: dateStr,
        projected: projectedOccupancy,
        booked: currentOccupancy
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      status: 'success',
      data: {
        projections,
        period: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 