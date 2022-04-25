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

export const getCommentWithoutReply = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const postId = req.query.postId;
    const lastComment = req.query.lastComment;
    const size = req.query.size;

    try {
        const resultComments = await prisma.comment.findMany({
            where: { 
                AND: [
					{ commentParent: 0 },
					{ postId: Number(postId) },
                    { commentId: { gte: Number(lastComment) }}
				] },
            take: Number(size),

        })

        return res.json({ opcode: OPCODE.SUCCESS, resultComments });

    } catch(error) {
        console.log(error);
        next(error);
    }
}