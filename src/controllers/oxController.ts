import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const createOxQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let ox = {
        oxquestion: req.body.oxquestion,
        oxanswer: req.body.oxanswer,
        subject: req.body.subject,
		grade: req.body.grade,
        range: 0,
        explanation: req.body.explanation,
        provider: req.body.provider
	}

    try {
        const createOx = await prisma.oXDB.create({
            data: ox
        });

        return res.json({ opcode: OPCODE.SUCCESS, createOx });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const getOxQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    let oxquestionId = parseInt(String(req.query.oxquestionId));

    try {
        const oxQuestion = await prisma.oXDB.findUnique({
            where: { oxquestionId: oxquestionId}
        })
        return res.json({ opcode: OPCODE.SUCCESS, oxQuestion });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const updateOxQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const oxquestionId = parseInt(req.params.id);
    let ox = {
        oxquestion: req.body.oxquestion,
        oxanswer: req.body.oxanswer,
        subject: req.body.subject,
		grade: req.body.grade,
        range: 0,
        explanation: req.body.explanation,
        provider: req.body.provider
	}

    try {
        const updateOx = await prisma.oXDB.update({
            where: { oxquestionId: oxquestionId },
            data: ox
        })

        return res.json({ opcode: OPCODE.SUCCESS, updateOx });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const deleteOxQuestion = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const oxquestionId = parseInt(req.params.id);

    try {
        const result = await prisma.oXDB.delete({
            where: { oxquestionId: oxquestionId }
        })

        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const getOxStats = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const oxquestionId = parseInt(String(req.query.oxquestionId));

    try {
        const result = await prisma.oXDB.findUnique({
            where: { oxquestionId: oxquestionId },
            select: { totalNumSolved: true, correctNum: true }
        })

        return res.json({ opcode: OPCODE.SUCCESS, totalNumSolved: result.totalNumSolved, correctNum: result.correctNum });


    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const increaseTotalNumSolved = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const oxquestionId = parseInt(req.params.id);

    try {
        const getTotalNumSolved = await prisma.oXDB.findUnique({
            where: { oxquestionId: oxquestionId },
            select: { totalNumSolved: true }
        })

        const updateOx = await prisma.oXDB.update({
            where: { oxquestionId: oxquestionId },
            data: { totalNumSolved :  getTotalNumSolved.totalNumSolved + 1}
        })

        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const increaseCorrectNum = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const oxquestionId = parseInt(req.params.id);

    try {
        const getCorrectNum = await prisma.oXDB.findUnique({
            where: { oxquestionId: oxquestionId },
            select: { correctNum: true }
        })

        const updateOx = await prisma.oXDB.update({
            where: { oxquestionId: oxquestionId },
            data: { correctNum :  getCorrectNum.correctNum + 1}
        })

        return res.json({ opcode: OPCODE.SUCCESS });

    } catch(error) {
        console.log(error);
        next(error);
    }
}