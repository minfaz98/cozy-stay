import { z } from 'zod';
import prisma from '../../config/prisma';
import { AppError } from '../../middleware/error';
import { RoomType } from '@prisma/client';
const roomSchema = z.object({
    number: z.number().int().positive(),
    type: z.nativeEnum(RoomType),
    isSuite: z.boolean(),
    bedCount: z.number().int().positive(),
    rateNight: z.number().positive(),
    rateWeek: z.number().positive().optional(),
    rateMonth: z.number().positive().optional()
});
export const listRooms = async (req, res) => {
    try {
        const { type, available, date } = z.object({
            type: z.nativeEnum(RoomType).optional(),
            available: z.boolean().optional(),
            date: z.string().datetime().optional()
        }).parse(req.query);
        const where = {};
        if (type)
            where.type = type;
        if (available && date) {
            where.reservations = {
                none: {
                    OR: [
                        {
                            AND: [
                                { arrivalDate: { lte: new Date(date) } },
                                { departureDate: { gt: new Date(date) } }
                            ]
                        },
                        { status: { in: ['CONFIRMED', 'CHECKED_IN'] } }
                    ]
                }
            };
        }
        const rooms = await prisma.room.findMany({
            where,
            include: {
                reservations: {
                    where: {
                        status: { in: ['CONFIRMED', 'CHECKED_IN'] }
                    },
                    select: {
                        arrivalDate: true,
                        departureDate: true
                    }
                }
            }
        });
        res.json(rooms);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, 'Invalid query parameters');
        }
        throw error;
    }
};
export const createRoom = async (req, res) => {
    try {
        const data = roomSchema.parse(req.body);
        const existingRoom = await prisma.room.findUnique({
            where: { number: data.number }
        });
        if (existingRoom) {
            throw new AppError(400, 'Room number already exists');
        }
        const room = await prisma.room.create({ data });
        res.status(201).json(room);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, 'Invalid room data');
        }
        throw error;
    }
};
export const updateRoom = async (req, res) => {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const data = roomSchema.partial().parse(req.body);
        const room = await prisma.room.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(room);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, 'Invalid room data');
        }
        throw error;
    }
};
export const deleteRoom = async (req, res) => {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const room = await prisma.room.findUnique({
            where: { id: parseInt(id) },
            include: {
                reservations: {
                    where: {
                        status: { in: ['CONFIRMED', 'CHECKED_IN'] }
                    }
                }
            }
        });
        if (!room) {
            throw new AppError(404, 'Room not found');
        }
        if (room.reservations.length > 0) {
            throw new AppError(400, 'Cannot delete room with active reservations');
        }
        await prisma.room.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, 'Invalid room ID');
        }
        throw error;
    }
};
