import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';
import { ServerStreamFileResponseOptionsWithError } from "http2";
import { NetConnectOpts } from "net";

const prisma = new PrismaClient();


export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let post = {
        title: req.body.title,
        postKind: req.body.postKind,
        content: req.body.content,
        userId: req.body.userId,
        categoryId: req.body.categoryId
    }

    try {
        const result = await prisma.post.create({
            data: post
        })
        return res.json({ opcode: OPCODE.SUCCESS, result });


    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const getMostLikePost = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate()-1);

    today.setUTCHours(0,0,0.0);
    yesterday.setUTCHours(0,0,0.0);

    try {
        //어제 올라온 모든 post 호출
        const getYesterdayPost = await prisma.post.findFirst({
            where:{
                createdAt:{
                    lte: today,
                    gte: yesterday
                }
            },
            orderBy:{
                like:{
                    _count: 'desc'
                }
            }
        })

        //const getMostLikePost = await prisma.like
        //가장 많은 like를 얻은 postId return
        console.log(getYesterdayPost);
        return res.json({ opcode: OPCODE.SUCCESS, getYesterdayPost });

    }   catch(error) {
        console.log(error);
        next(error);
    }
}

export const sortingPostByCategory = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const categoryId = parseInt(String(req.query.categoryId));

    try {
        const resultPosts = await prisma.post.findMany({
            where: { 
                categoryId 
            },

            orderBy: { 
                createdAt: 'desc' 
            }
        });

        return res.json({ opcode: OPCODE.SUCCESS, resultPosts });

	}   catch(error){
		console.log(error);
		next(error);
	}
}


export const sortingByKind = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const postKind = parseInt(String(req.query.postKind));

    try {
        const resultPosts = await prisma.post.findMany({
            where: { 
                postKind: postKind 
            },

            orderBy: { 
                createdAt: 'desc' 
            }
        });

        return res.json({ opcode: OPCODE.SUCCESS, resultPosts });

	}   catch(error){
		console.log(error);
		next(error);
	}
}

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const postId = parseInt(String(req.query.postId));
    console.log("postId: ", postId);

	try {
		const result = await prisma.post.delete({
            where: { postId }
        })
        return res.json({ opcode: OPCODE.SUCCESS });

    }   catch(error) {
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
        
    }   catch(error) {
        console.log(error);
        next(error);
    }
}

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let post = {
		title: req.body.title,
		content: req.body.content,
		postKind: req.body.postKind,
		anonymous: req.body.anonymous
	}

	try {
		const postData = await prisma.post.update({
			where: {
				postId: Number(req.body.postId)
			},
			data: post
		});
		
		return res.json({ opcode: OPCODE.SUCCESS, postData });
	}   catch(error) {
		console.log(error);
		next(error);
	}
}

export const getPostByTitle = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const search = req.body.search;

	try {
		const posts = await prisma.post.findMany({
			where: {
				title: {
					contains: `${search}`
				}
			}
		});

		return res.json({ opcode: OPCODE.SUCCESS, posts });

	}   catch(error) {
		console.log(error);
		next(error);
	}
}