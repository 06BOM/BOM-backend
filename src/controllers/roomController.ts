import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getRoomInformation = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const roomId = parseInt(String(req.query.roomId));

    try {
        const resultRoom = await prisma.room.findUnique({
            where:{
                roomId: roomId
            }
        })

        return res.json({ opcode: OPCODE.SUCCESS, resultRoom })

    } catch(error) {
        console.log(error);
        next(error);
    }
}
