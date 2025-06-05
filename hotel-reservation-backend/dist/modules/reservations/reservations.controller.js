import prisma from '../../config/prisma';
import { ResStatus } from '@prisma/client';
export const createReservation = async (req, res) => {
    const { roomId, occupants, arrivalDate, departureDate, guaranteeCC } = req.body;
    const reservation = await prisma.reservation.create({
        data: {
            userId: req.user.sub,
            roomId,
            occupants,
            arrivalDate: new Date(arrivalDate),
            departureDate: new Date(departureDate),
            guaranteeCC
        }
    });
    res.status(201).json(reservation);
};
export const cancelReservation = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const reservation = await prisma.reservation.update({
        where: { id },
        data: { status: ResStatus.CANCELLED }
    });
    res.json(reservation);
};
