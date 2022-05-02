import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let category = {
        categoryName: String(req.body.categoryName), 
        color: String(req.body.color), 
        type: req.body.type, 
        userId: Number(req.body.userId)
    }
    try {
        const resultCategory = await prisma.category.create({
            data: category
        })

        return res.json({ opcode: OPCODE.SUCCESS, resultCategory });

    } catch (error) {

    }
}