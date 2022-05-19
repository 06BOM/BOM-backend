import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const createQuestQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let mock = {
		grade: req.body.grade,
        subject: req.body.subject,
        questionImage: req.body.questionImage,
        answer: req.body.answer,
        explanation: req.body.explanation,
        provider: req.body.provider
	}

    try {
        const createMock = await prisma.mockDB.create({
            data: mock
        });

        return res.json({ opcode: OPCODE.SUCCESS, createMock });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const getQuestQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let grade = parseInt(String(req.query.grade));
    let subject = String(req.query.subject);

    try {
        const Questions = await prisma.mockDB.findMany({
            where: {
                AND: [
                    { grade: grade },
                    { subject: subject }
                ]
            }
        })

        return res.json({ opcode: OPCODE.SUCCESS, Questions });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const updateQuestQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const mockId = parseInt(req.params.id);
    let mock = {
		grade: req.body.grade,
        subject: req.body.subject,
        questionImage: req.body.questionImage,
        answer: req.body.answer,
        explanation: req.body.explanation,
        provisionCheck: req.body.provisionCheck,
        totalNumSolved: req.body.totalNumSolved,
        correctNum: req.body.correctNum,
        provider: req.body.provider
	}

    try {
        const updateMock = await prisma.mockDB.update({
            where: { mockquestionId: mockId },
            data: mock
        })

        return res.json({ opcode: OPCODE.SUCCESS, updateMock });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const deleteQuestQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const mockId = parseInt(req.params.id);

    try {
        const result = await prisma.mockDB.delete({
            where: { mockquestionId: mockId }
        })
        return res.json({ opcode: OPCODE.SUCCESS });


    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const provisionCheckToTrue = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const mockId = parseInt(req.params.id);

    try {
        const updateMock = await prisma.mockDB.update({
            where: { mockquestionId: mockId },
            data: { provisionCheck: true }
        })
        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const increaseTotalNumSolved = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const mockId = parseInt(req.params.id);
    try {
        const getTotalNumSolved = await prisma.mockDB.findUnique({
            where: { mockquestionId: mockId },
            select: { totalNumSolved: true }
        })

        const updateMock = await prisma.mockDB.update({
            where: { mockquestionId: mockId },
            data: { totalNumSolved :  getTotalNumSolved.totalNumSolved + 1}
        })
        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const increaseCorrectNum  = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const mockId = parseInt(req.params.id);

    try {
        const getCorrectNum = await prisma.mockDB.findUnique({
            where: { mockquestionId: mockId },
            select: { correctNum: true }
        })

        const updateMock = await prisma.mockDB.update({
            where: { mockquestionId: mockId },
            data: { correctNum:  getCorrectNum.correctNum + 1 }
        })
        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const getQuestStats = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const mockId = parseInt(String(req.query.mockquestionId));

    try {
        const result = await prisma.mockDB.findUnique({
            where: { mockquestionId: mockId },
            select: { totalNumSolved: true, correctNum: true }
        })

        let statistic = (result.correctNum / result.totalNumSolved) * 100;

        return res.json({ opcode: OPCODE.SUCCESS, statistic: statistic.toFixed(2), totalNumSolved: result.totalNumSolved, correctNum: result.correctNum });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const getQuestQuestionsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const userId = parseInt(req.params.userId);

    try {
        const questions = await prisma.mockDB.findMany({
            where: { provider: userId }
        })

        return res.json({ opcode: OPCODE.SUCCESS, questions });

    } catch(error) {
        console.log(error);
        next(error);
    }
}