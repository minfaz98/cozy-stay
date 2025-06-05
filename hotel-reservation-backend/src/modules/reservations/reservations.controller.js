import { z } from "zod";
import prisma from "../../config/prisma.js";
import { AppError } from "../../middleware/error.js";

const reservationSchema = z.object({
  roomId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().positive(),
  status: z
    .enum([
      "CONFIRMED",
      "PENDING",
      "CANCELLED",
      "NO_SHOW",
      "CHECKED_IN",
      "CHECKED_OUT",
    ])
    .optional()
    .default("PENDING"),
  totalAmount: z.number().min(0),
  creditCard: z
    .object({
      cardNumber: z.string().length(16),
      expiryMonth: z.number().int().min(1).max(12),
      expiryYear: z.number().int().min(new Date().getFullYear()),
      cvv: z.string().min(3).max(4),
      holderName: z.string().min(1),
    })
    .optional(),
});

const bulkBookingSchema = z.object({
  roomType: z.enum(["SINGLE", "DOUBLE", "FAMILY", "DELUXE", "SUITE"]),
  numberOfRooms: z.number().int().min(2),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  discountRate: z.number().min(0).max(0.5),
  specialRequests: z.string().optional(),
  creditCard: z.object({
    cardNumber: z.string().length(16),
    expiryMonth: z.number().int().min(1).max(12),
    expiryYear: z.number().int().min(new Date().getFullYear()),
    cvv: z.string().min(3).max(4),
    holderName: z.string().min(1),
  }),
});

export const listReservations = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;

    const where = {};
    if (status) where.status = status;
    if (startDate && endDate) {
      where.OR = [
        {
          checkIn: { lte: new Date(endDate) },
          checkOut: { gte: new Date(startDate) },
        },
      ];
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    });

    res.json({
      status: "success",
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (req, res, next) => {
  try {
    const validatedData = reservationSchema.parse(req.body);
    const { roomId, checkIn, checkOut, guests, creditCard, totalAmount } =
      validatedData;

    // Check if room exists and is available
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError(404, "Room not found");
    }

    // Check if room is available for the dates
    const overlappingReservation = await prisma.reservation.findFirst({
      where: {
        roomId,
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
        OR: [
          {
            checkIn: { lte: new Date(checkOut) },
            checkOut: { gte: new Date(checkIn) },
          },
        ],
      },
    });

    if (overlappingReservation) {
      throw new AppError(400, "Room is not available for the selected dates");
    }

    // Set initial status based on credit card presence
    const initialStatus = creditCard ? "CONFIRMED" : "PENDING";

    // Check if it's past 7 PM for pending reservations
    if (!creditCard) {
      const now = new Date();
      const cutoffTime = new Date();
      cutoffTime.setHours(19, 0, 0, 0);

      if (now >= cutoffTime) {
        throw new AppError(
          400,
          "Pending reservations cannot be created after 7 PM. Please provide credit card details to confirm the booking."
        );
      }
    }

    // Create the reservation
    const reservationData = {
      roomId,
      userId: req.user.id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      status: initialStatus,
      totalAmount,
    };

    if (creditCard) {
      reservationData.creditCard = {
        create: {
          cardNumber: creditCard.cardNumber,
          expiryMonth: creditCard.expiryMonth,
          expiryYear: creditCard.expiryYear,
          cvv: creditCard.cvv,
          holderName: creditCard.holderName,
        },
      };
      reservationData.billing = {
        create: {
          userId: req.user.id,
          amount: totalAmount,
          status: "PENDING",
          paymentMethod: "CREDIT_CARD",
        },
      };
    }

    const reservation = await prisma.reservation.create({
      data: reservationData,
      include: {
        room: true,
        creditCard: true,
        billing: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    if (error instanceof z.ZodError) {
      next(
        new AppError(
          400,
          "Invalid reservation data: " +
            error.errors.map((e) => e.message).join(", ")
        )
      );
    } else {
      next(error);
    }
  }
};

export const updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = reservationSchema.partial().parse(req.body);

    // If dates are being updated, check availability
    if (
      validatedData.checkIn ||
      validatedData.checkOut ||
      validatedData.roomId
    ) {
      const reservation = await prisma.reservation.findUnique({
        where: { id: id },
      });

      const conflictingReservation = await prisma.reservation.findFirst({
        where: {
          roomId: validatedData.roomId || reservation.roomId,
          id: { not: id },
          status: { in: ["CONFIRMED", "CHECKED_IN"] },
          OR: [
            {
              checkIn: {
                lte: new Date(validatedData.checkOut || reservation.checkOut),
              },
              checkOut: {
                gte: new Date(validatedData.checkIn || reservation.checkIn),
              },
            },
          ],
        },
      });

      if (conflictingReservation) {
        throw new AppError(400, "Room is not available for the selected dates");
      }
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: id },
      data: validatedData,
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      status: "success",
      data: updatedReservation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, "Invalid reservation data"));
    } else {
      next(error);
    }
  }
};

export const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new AppError(404, "Reservation not found");
    }

    // Check if user is authorized to cancel this reservation
    if (
      userRole !== "MANAGER" &&
      userRole !== "STAFF" &&
      reservation.userId !== userId
    ) {
      throw new AppError(
        403,
        "You are not authorized to cancel this reservation"
      );
    }

    if (reservation.status === "CANCELLED") {
      throw new AppError(400, "Reservation is already cancelled");
    }

    if (reservation.status === "CHECKED_OUT") {
      throw new AppError(400, "Cannot cancel a checked-out reservation");
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: {
        room: true,
      },
    });

    res.json({
      status: "success",
      data: updatedReservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserReservations = async (req, res, next) => {
  try {
    console.log("User from request:", req.user); // Debug log
    const userId = req.user.id;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    });

    res.json({
      status: "success",
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const createBulkBooking = async (req, res, next) => {
  try {
    // Check if user is a company
    if (req.user.role !== "COMPANY") {
      throw new AppError(403, "Only travel companies can make bulk bookings");
    }

    const validatedData = bulkBookingSchema.parse(req.body);
    const {
      roomType,
      numberOfRooms,
      checkIn,
      checkOut,
      discountRate,
      specialRequests,
      creditCard,
    } = validatedData;

    // Find available rooms of the specified type
    const availableRooms = await prisma.room.findMany({
      where: {
        type: roomType,
        status: "AVAILABLE",
        reservations: {
          none: {
            AND: [
              { status: { in: ["CONFIRMED", "CHECKED_IN"] } },
              {
                OR: [
                  {
                    checkIn: { lte: new Date(checkOut) },
                    checkOut: { gte: new Date(checkIn) },
                  },
                ],
              },
            ],
          },
        },
      },
      take: numberOfRooms,
    });

    if (availableRooms.length < numberOfRooms) {
      throw new AppError(
        400,
        "Not enough rooms available for the requested dates"
      );
    }

    // Create reservations for each room
    const reservations = await Promise.all(
      availableRooms.map(async (room) => {
        const reservation = await prisma.reservation.create({
          data: {
            roomId: room.id,
            userId: req.user.id,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            status: "CONFIRMED",
            totalAmount: room.price * (1 - discountRate),
            creditCard: {
              create: {
                cardNumber: creditCard.cardNumber,
                expiryMonth: creditCard.expiryMonth,
                expiryYear: creditCard.expiryYear,
                cvv: creditCard.cvv,
                holderName: creditCard.holderName,
              },
            },
            billing: {
              create: {
                userId: req.user.id,
                amount: room.price * (1 - discountRate),
                status: "PENDING",
                paymentMethod: "CREDIT_CARD",
              },
            },
          },
          include: {
            room: true,
            creditCard: true,
            billing: true,
          },
        });
        return reservation;
      })
    );

    res.status(201).json({
      status: "success",
      data: reservations,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(
          400,
          "Invalid bulk booking data: " +
            error.errors.map((e) => e.message).join(", ")
        )
      );
    } else {
      next(error);
    }
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id: id },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new AppError(404, "Reservation not found");
    }

    res.json({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        room: {
          select: {
            id: true,
            number: true,
            type: true,
            price: true,
            capacity: true,
            description: true,
            status: true,
            images: true,
          },
        },
        billing: true,
        creditCard: {
          select: {
            id: true,
            cardNumber: true,
            expiryMonth: true,
            expiryYear: true,
            holderName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate and add discount information
    const reservationsWithDiscount = reservations.map((reservation) => {
      const discountAmount = reservation.room.price - reservation.totalAmount;
      const discountPercentage = (
        (discountAmount / reservation.room.price) *
        100
      ).toFixed(1);

      return {
        ...reservation,
        discountInfo:
          discountAmount > 0
            ? {
                originalPrice: reservation.room.price,
                discountAmount,
                discountPercentage: parseFloat(discountPercentage),
              }
            : null,
      };
    });

    res.status(200).json({
      status: "success",
      data: reservationsWithDiscount,
    });
  } catch (error) {
    next(error);
  }
};

// Add a new function to handle auto-cancellation
export const cancelPendingReservations = async () => {
  try {
    const now = new Date();
    const today7PM = new Date();
    today7PM.setHours(19, 0, 0, 0);

    // If it's past 7 PM, cancel all pending reservations created before 7 PM today
    if (now >= today7PM) {
      const result = await prisma.reservation.updateMany({
        where: {
          status: "PENDING",
          createdAt: {
            lt: today7PM,
          },
        },
        data: {
          status: "CANCELLED",
        },
      });

      console.log(`Cancelled ${result.count} pending reservations`);
    }
  } catch (error) {
    console.error("Error cancelling pending reservations:", error);
  }
};
