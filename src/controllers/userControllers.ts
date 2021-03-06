import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';
const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let userId = Number(req.params.userId);
	try {
		const getUserResult = await prisma.user.findUnique({
            where:{
                userId: userId
            },
        });
		console.log({ opcode:OPCODE.SUCCESS, getUserResult });
		return res.json({ opcode:OPCODE.SUCCESS, getUserResult });

	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let userId = Number(req.params.userId);

	try {
		await prisma.user.delete({
            where:{
				userId: userId
            },
        });
		return res.json({ opcode:OPCODE.SUCCESS });

	} catch(error) {
		console.log(error);
		next(error);
	}
};


export const modifyUser = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let userInfo = {
		nickname: req.body.nickname,
		phoneNum: req.body.phoneNum,
		introduction: req.body.introduction,
		grade: req.body.grade,
		birth: req.body.birth,
		star : req.body.star
	}

	let userId = Number(req.params.userId);

	try {
		const modifyUserResult = await prisma.user.update({
            where:{
                userId: userId
            },
            data: userInfo
        });
		console.log({ opcode:OPCODE.SUCCESS, modifyUserResult });
		return res.json({ opcode:OPCODE.SUCCESS, modifyUserResult });

	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const changeCharacter = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	
	const userId = Number(req.body.userId);
	const newCharacterId = Number(req.body.characterId);

	try {
		const modifyUserResult = await prisma.user.update({
            where:{
                userId: userId
            },
            data: {
				characterId : newCharacterId
			}
        });
		return res.json({ opcode:OPCODE.SUCCESS, modifyUserResult });

	} catch(error) {
		console.log(error);
		next(error);
	}
};