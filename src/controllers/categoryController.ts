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
        console.log(error);
        next(error);
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {

    let categoryId = parseInt(req.params.categoryId);
    
    try {
        await prisma.category.delete({
            where:{
                categoryId: categoryId
            }
        })

        return res.json({ opcode: OPCODE.SUCCESS });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getCategory = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const userId = parseInt(String(req.query.userId));

	try {
		const category = await prisma.category.findMany({
			where: { userId }
		});

		return res.json({ opcode: OPCODE.SUCCESS, category });
	} catch(error) {
		console.log(error);
		next(error);
	}
}