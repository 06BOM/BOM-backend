import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let comment = {
		content: String(req.body.content),
		commentParent: req.body.commentParent? parseInt(String(req.body.commentParent)) : 0,
		postId: parseInt(String(req.body.postId)),
		// @ts-ignore
		userId: parseInt(String(req.user.userId))
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

export const createReply = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	try {
		const reply = await prisma.comment.create({
			data: {
				postId: req.body.postId,
				// @ts-ignore
				userId: req.user.userId,
				content: req.body.content,
				commentParent: req.body.parentId
			}
		});

		return res.status(201).json({ opcode: OPCODE.SUCCESS, reply });
	
	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let comment = {
		content: req.body.content,
		commentParent: req.body.commentParent,
		createdAt: new Date(),
		postId: req.body.postId,
		// @ts-ignore
		userId: req.user.userId
	}
	let commentId = parseInt(req.params.commentId);

	try {
		const resultComment = await prisma.comment.update({
            where: {
                commentId: commentId
            },
            data: comment
        })

		return res.json({ opcode: OPCODE.SUCCESS, resultComment });

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	
	let commentId = parseInt(req.params.commentId);

	try {
		const resultComment = await prisma.comment.delete({
            where: {
                commentId: commentId
            }
        })

		return res.json({ opcode: OPCODE.SUCCESS });

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getCommentWithReply = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const commentId = Number(req.query.commentId);

	try {
		const comment = await prisma.comment.findUnique({
			where: {
				commentId
			}
		});
		if (!comment) {
			return res.status(200).json({ opcode: OPCODE.SUCCESS, msg: "no comment" });
		}	

		const reply = await prisma.comment.findMany({
			where: { commentParent: commentId },
			orderBy: { createdAt: 'desc' }
		});

		return res.status(201).json({ opcode: OPCODE.SUCCESS, reply });
	} catch(error) {
		console.log(error);
		next(error);
	}
};