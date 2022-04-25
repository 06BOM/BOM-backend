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

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	// const postId = parseInt(String(req.body.postId));
	const title = req.body.title;
	const content = req.body.content;
	const postKind = parseInt(String(req.body.postKind));
	const anonymous = Boolean(req.body.anonymous);

	//const postId2 = req.query.postId;

	console.log("postId", postId2);
	const postId = Number(postId2);
	console.log("postId", postId);
	console.log("title", title);
	console.log("content", content);
	console.log("postKind", postKind);
	console.log("anonymous", anonymous);
	try {
		const postData = await prisma.post.findUnique({
			where: {
				postId
			}
		});
		/*
		const post = await prisma.post.update({
			where: {
				postId
			},
			data: {
				title,
				content,
				postKind,
				anonymous
			},
		});*/
		console.log("post", postData);
		return res.json({ opcode: OPCODE.SUCCESS, postData });
	} catch(error) {
		console.log(error);
		next(error);
	}
}