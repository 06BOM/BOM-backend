import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const createQuestAttempt = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let questAttempt = {
        questionId: Number(req.body.questionId),
		count: Number(req.body.count), 
		date: new Date((req.body.date)),
		// @ts-ignore
        userId: Number(req.user.userId)
    }
    try {
        const resultQuestAttempt = await prisma.questAttempt.create({
            data: questAttempt
        });

        return res.json({ opcode: OPCODE.SUCCESS, resultQuestAttempt });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getQuestAttempt = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const userId = parseInt(String(req.query.userId));
	const questionId = parseInt(String(req.query.questionId));

	try {
		const questAttempt = await prisma.questAttempt.findFirst({
			where: { userId, questionId }
		});

		return res.json({ opcode: OPCODE.SUCCESS, questAttempt });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const updateQuestAttempt = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let questAttempt = {
        questionId: Number(req.body.questionId),
		count: Number(req.body.count), 
		date: new Date((req.body.date)),
        userId: Number(req.body.userId)
    }

	try {
		const resultQuestAttempt = await prisma.questAttempt.update({
            where: {
				questionId_userId: {
					userId: questAttempt.userId,
					questionId: questAttempt.questionId
				}
            },
            data: questAttempt
        })

		return res.json({ opcode: OPCODE.SUCCESS, resultQuestAttempt });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const deleteQuestAttempt = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const userId = parseInt(String(req.query.userId));
	const questionId = parseInt(String(req.query.questionId));

    try {
        await prisma.questAttempt.delete({
            where:{
                questionId_userId: {
					userId: userId,
					questionId: questionId
				}
            }
        })

        return res.json({ opcode: OPCODE.SUCCESS });
    } catch (error) {
        console.log(error);
        next(error);
    }
}