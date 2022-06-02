import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from 'express';
import { Token } from "../tools/token";
import { DamoyeoError } from "../tools";
const prisma = new PrismaClient();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authorization = req.headers.authorization;
		
		if (!authorization) {
			throw new DamoyeoError('로그인이 필요한 서비스입니다.', 403);
		}

		const accessToken = authorization.replace('Bearer ', '');
		const { payload } = Token.verifyJwt(accessToken);

		if (payload) {
			const session = await prisma.session.findFirst({ where: {
				// @ts-ignore 
				sessionId: payload.sessionId 
			} });
		
			if (!session) {
				throw new DamoyeoError('로그인이 필요합니다.', 403);
			}
			req.user = payload;
			return next();
		} else {
			throw new DamoyeoError('access token이 만료되었습니다.', 401);
		}
	} catch(error) {
		console.log(error);
		next(error);
	}	
}