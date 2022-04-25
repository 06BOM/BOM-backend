import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const postId = parseInt(String(req.query.postId));

	try {
        const result = await prisma.post.delete({
            where: { postId }
        })

        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const soltingPostByCategory = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const categoryId = parseInt(String(req.query.categoryId));

    try {
        const resultPosts = await prisma.post.findMany({
            where: { categoryId },
            orderBy: { createdAt: 'desc' }
        })

        return res.json({ opcode: OPCODE.SUCCESS, resultPosts });
        
    } catch(error) {
        console.log(error);
        next(error);
    }
}
