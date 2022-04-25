import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';
import { ServerStreamFileResponseOptionsWithError } from "http2";
import { NetConnectOpts } from "net";

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

export const getPostbyPostId = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const postId = parseInt(req.params.postId);

    try {
        const resultPost = await prisma.post.findUnique({
            where: { postId }
        })

        return res.json({ opcode: OPCODE.SUCCESS, resultPost });
        
    } catch(error) {
        console.log(error);
        next(error);
    }
}
