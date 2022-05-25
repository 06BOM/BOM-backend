import { PrismaClient } from "@prisma/client";
import { OPCODE, Sessions, Token } from "../tools";
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

const prisma = new PrismaClient();

export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => { 
    try {
		let existUser = true;
	
		const { kakaoAccessToken } = req.body;
		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Bearer " + kakaoAccessToken
		};
		const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
			headers,
		});
		let user = await prisma.user.findFirst({
			where: {
				AND: [
					{ platform: "kakao" },
					{ platformId: response.data.id }
				]
			}
		});

		if (!user) {
			let userContent = {
				platform: 'kakao',
				platformId: String(response.data.id),
				nickname: String(response.data.properties.nickname),
				userName: String(response.data.properties.userName)
			}
			
			user = await prisma.user.create({
				data: userContent
			});
			existUser = false;
		}

		const sessionId = await Sessions.createSession(user);
		const accessToken = Token.signJwt(
			{userId: user.userId, sessionId},
			"5s"
		);
		const refreshToken = Token.signJwt(
			{ sessionId },
			"1d"
		)

		if (existUser === true) {
			return res.status(201).json({ accessToken, refreshToken});
		} else {
			return res.status(200).json({ accessToken, refreshToken});
		}
    } catch(error) {
        console.log(error);
        next(error);
    }
}