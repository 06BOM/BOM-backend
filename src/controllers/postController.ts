import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const postId = parseInt(String(req.query.postId));
    console.log("postId: ", postId);

	try {

        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}
