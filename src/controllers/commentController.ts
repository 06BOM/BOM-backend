import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';
import { ServerStreamFileResponseOptionsWithError } from "http2";
import { NetConnectOpts } from "net";

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let comment = {
		content: String(req.body.content),
		commentParent: req.body.commentParent? parseInt(String(req.body.commentParent)) : 0,
		postId: parseInt(String(req.body.postId)),
		userId: parseInt(String(req.body.userId))
	}

    try {
        const resultComment = await prisma.comment.create({
            data: comment
        })

        return res.json({ opcode: OPCODE.SUCCESS, resultComment })

    } catch(error) {
        console.log(error);
        next(error);
    }
}