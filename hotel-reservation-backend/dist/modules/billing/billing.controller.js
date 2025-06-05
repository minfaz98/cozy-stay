import prisma from '../../config/prisma';
export const listBillings = async (_req, res) => {
    const bills = await prisma.billing.findMany();
    res.json(bills);
};
