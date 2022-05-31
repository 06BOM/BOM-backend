import { PrismaClient } from "@prisma/client";
import { OPCODE, Sessions, Token, DamoyeoError } from "../tools";
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import util from 'util';
import crypto from 'crypto';

const prisma = new PrismaClient();

const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const createSalt = async () => {
	const buf = await randomBytesPromise(64);
  
	return buf.toString("base64");
  };

const createHashedPassword = async (password) => {
	const salt = await createSalt();
	const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");
	const hashedPassword = key.toString("base64");
	
	return { hashedPassword: hashedPassword, salt: salt };
  };

  //일치: true, 불일치: false return
const verifyPassword = async (password, userSalt, userPassword) => {
	const key = await pbkdf2Promise(password, userSalt, 104906, 64, "sha512");
	const hashedPassword = key.toString("base64");

	if (hashedPassword === userPassword) return true;
	return false;
  };

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => { 
	let emailId = String(req.body.emailId);
	
	try {
		let isExist = await prisma.user.findFirst({
			where: { emailId: emailId }
		}) 
	
		if ( !isExist ){
			let userInfo = {
				emailId: emailId,
				grade: req.body.grade,
				password: "",
				salt: "",
				userName: String(req.body.userName),
				phoneNum: String(req.body.phoneNum),
				birth: new Date(req.body.birth),
				nickname: String(req.body.nickname),
				userType: req.body.userType,
				introduction: String(req.body.introduction)
			}
		
			const hash =  await createHashedPassword(req.body.password);
			userInfo.password = hash.hashedPassword;
			userInfo.salt = hash.salt;

			const result = await prisma.user.create({
				data: userInfo
			})

			return  res.json({ opcode: OPCODE.SUCCESS, result });

		} else {
			return  res.json({ opcode: OPCODE.ERROR });
		}
		
	} catch (error) {
		console.log(error);
        next(error);
	}
}

export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => { 
	try {
		const platform = String(req.body.platform);

		switch(platform){
			case "local" : {
				const emailId = String(req.body.emailId);
				const passwd = req.body.password;

				const userData = await prisma.user.findUnique({
					where: {
						emailId : emailId
					}
				})

				const verified = await verifyPassword(passwd, userData.salt, userData.password);

				if(userData){
					if(verified){
						return res.json({ opcode: OPCODE.SUCCESS, userData });
					}
					else{
						return res.json({ opcode: OPCODE.ERROR });
					}
				}
			}

			case "naver" : {
				let existUser = true;
   
				const naverAccessToken = req.body.accessToken;
		
				const headers = {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: "Bearer " + naverAccessToken
				};
		
				const response = await axios.get("https://openapi.naver.com/v1/nid/me", {
					headers,
				});

				console.log("response: ", response.data.response);
		
				let user = await prisma.user.findFirst({
				where: {
					AND: [
						{ platform: "naver" },
						{ platformId: response.data.response.id }
					]
				}});
		
				if (!user) {
				let userContent = {
					platform: 'naver',
					platformId: String(response.data.response.id),
					nickname: String(response.data.response.name),
					userName: String(response.data.response.name)
				}
				
				user = await prisma.user.create({
					data: userContent
				});

				existUser = false;
				}
				
				const sessionId = await Sessions.createSession(user);
				const accessToken = Token.signJwt(
					{userId: user.userId, sessionId},
					"1h"
				);

				const refreshToken = Token.signJwt(
					{ sessionId },
					"1w"
				);
		
				if (existUser === true) {
					return res.status(201).json({ opcode: OPCODE.SUCCESS, payload: {accessToken, refreshToken} });
				} else {
					return res.status(200).json({ opcode: OPCODE.SUCCESS, payload: {accessToken, refreshToken} });
				}
			}

			case "kakao" : {
				let existUser = true;
				const kakaoAccessToken = req.body.accessToken;
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
							{ platformId: String(response.data.id) }
						]
					}
				});

				if (!user) {
					let userContent = {
						platform: 'kakao',
						platformId: String(response.data.id),
						nickname: String(response.data.properties.nickname),
						userName: String(response.data.properties.nickName)
					}
			
					user = await prisma.user.create({
						data: userContent
					});
					
					existUser = false;
				}

				const sessionId = await Sessions.createSession(user);
				const accessToken = Token.signJwt(
					{userId: user.userId, sessionId},
					"1h"
				);
				const refreshToken = Token.signJwt(
					{ sessionId },
					"1w"
				);

				if (existUser === true) {
					return res.status(201).json({ opcode: OPCODE.SUCCESS, payload: {accessToken, refreshToken} });
				} else {
					return res.status(200).json({ opcode: OPCODE.SUCCESS, payload: {accessToken, refreshToken} });
				}
			}
		}

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const logOut = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	try {
		await prisma.session.delete({
            where:{
				// @ts-ignore
                sessionId: req.user.sessionId
            }
        });
		return res.sendStatus(204);
	} catch(error) {
		console.error(error);
        next(error);
	}
}

export const newToken = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {	
	try {
		const refreshToken = req.body.refreshToken;
		if (!refreshToken) {
			throw new DamoyeoError('refresh token이 필요합니다.', 401);
		}
		const { payload } = Token.verifyJwt(refreshToken);
		if (!payload) {
			throw new DamoyeoError('refresh token이 필요합니다.', 401);
		}

		// @ts-ignore
		const session = await Sessions.getSession(payload.sessionId);
		if (!session) {
			throw new DamoyeoError('access token을 발급할 수 없습니다.', 404);
		}

		const newAccessToken = Token.signJwt(
			// @ts-ignore
			{ sessionId: session.sessionId, userId: session.userId },
			"1h"
		);

		return res.status(200).json({ accessToken: newAccessToken });
	} catch(error) {
		console.error(error);
        next(error);		
	}
}