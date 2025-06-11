import { z } from "zod";
import prisma from "../../config/prisma.js";
import { AppError } from "../../middleware/error.js";

const roomSchema = z.object({
  number: z.string(),
  type: z.enum(["SINGLE", "DOUBLE", "FAMILY", "DELUXE", "SUITE"]),
  price: z.number().positive(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]),
  capacity: z.number().int().positive(),
  amenities: z.array(z.string()),
  description: z.string(),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
});

export const listRooms = async (req, res, next) => {
  try {
    const { type, status, minPrice, maxPrice, capacity, checkIn, checkOut } =
      req.query;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (capacity) where.capacity = { gte: parseInt(capacity) };

    // Add date-based availability check
    if (checkIn && checkOut) {
      where.reservations = {
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
      };
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        reservations: {
          where: {
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
          },
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json({
      status: "success",
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to find an available room
export const assignAvailableRoom = async (roomType, checkIn, checkOut) => {
  try {
    const availableRoom = await prisma.room.findFirst({
      where: {
        type: roomType,
        status: "AVAILABLE", // Assuming 'AVAILABLE' status means ready for booking
        reservations: {
          none: {
            AND: [
              { status: { in: ["CONFIRMED", "CHECKED_IN"] } },
              {
                OR: [
                  { checkIn: { lte: new Date(checkOut) } },
                  { checkOut: { gte: new Date(checkIn) } },
                ],
              },
            ],
          },
        },
      },
    });
    return availableRoom;
  } catch (error) {
    console.error("Error assigning available room:", error);
    return null;
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        currentReservation: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new AppError(404, "Room not found");
    }

    res.json({
      status: "success",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const validatedData = roomSchema.parse(req.body);

    const existingRoom = await prisma.room.findFirst({
      where: { number: validatedData.number },
    });

    if (existingRoom) {
      throw new AppError(400, "Room number already exists");
    }

    const room = await prisma.room.create({
      data: validatedData,
    });

    res.status(201).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, "Invalid room data"));
    } else {
      next(error);
    }
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = roomSchema.partial().parse(req.body);

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new AppError(404, "Room not found");
    }

    if (validatedData.number) {
      const existingRoom = await prisma.room.findFirst({
        where: {
          number: validatedData.number,
          id: { not: id },
        },
      });

      if (existingRoom) {
        throw new AppError(400, "Room number already exists");
      }
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: validatedData,
    });

    res.json({
      status: "success",
      data: updatedRoom,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, "Invalid room data"));
    } else {
      next(error);
    }
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
          },
        },
      },
    });

    if (!room) {
      throw new AppError(404, "Room not found");
    }

    if (room.reservations.length > 0) {
      throw new AppError(400, "Cannot delete room with active reservation");
    }

    await prisma.room.delete({
      where: { id },
    });

    res.json({
      status: "success",
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const calculatePrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
      throw new AppError(400, "Check-in and check-out dates are required");
    }

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new AppError(404, "Room not found");
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    let totalPrice = room.price * nights;

    // Apply weekly rate if applicable
    if (room.weeklyRate && nights >= 7) {
      const weeks = Math.floor(nights / 7);
      const remainingNights = nights % 7;
      totalPrice = room.weeklyRate * weeks + room.price * remainingNights;
    }

    // Apply monthly rate if applicable
    if (room.monthlyRate && nights >= 30) {
      const months = Math.floor(nights / 30);
      const remainingNights = nights % 30;
      totalPrice = room.monthlyRate * months + room.price * remainingNights;
    }

    res.json({
      status: "success",
      data: {
        roomId: id,
        checkIn,
        checkOut,
        nights,
        pricePerNight: room.price,
        totalPrice,
        weeklyRate: room.weeklyRate,
        monthlyRate: room.monthlyRate,
      },
    });
  } catch (error) {
    next(error);
  }
};
