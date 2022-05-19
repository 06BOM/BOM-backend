import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getCharacterInfomation = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const characterId = Number(req.query.characterId);

	try {
		const character = await prisma.character.findUnique({
			where: {
				characterId
			}
		});
		return res.status(201).json({ opcode: OPCODE.SUCCESS, character });

	} catch(error) {
		console.log(error);
		next(error);
	}
};


export const getCharacterImageUrl = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const characterId = Number(req.query.characterId);

	try {
		const character = await prisma.character.findUnique({
			where: {
				characterId
			},
            select:{
                imageUrl:true
            }
		});
		return res.status(201).json({ opcode: OPCODE.SUCCESS, character});

	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const getAllCharacters = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const userId = Number(req.query.userId);

	try {
		const characters = await prisma.collection.findMany({
			where: {
				userId: userId
			},
            select:{
                characterId : true
            }
		});
		return res.status(201).json({ opcode: OPCODE.SUCCESS, characters});

	} catch(error) {
		console.log(error);
		next(error);
	}
};


