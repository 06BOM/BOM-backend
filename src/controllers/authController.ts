import { PrismaClient } from "@prisma/client";
import { OPCODE, Sessions, Token } from "../tools";
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { Strategy, Profile } from 'passport-naver-v2';
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
	const key = await pbkdf2Promise(password, userSalt, 99999, 64, "sha512");
	const hashedPassword = key.toString("base64");
  
	if (hashedPassword === userPassword) return true;
	return false;
  };

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => { 
	let userInfo = {
		emailId: String(req.body.emailId),
		grade: req.body.grade,
		password: "",
		salt: "",
		userName: String(req.body.userName),
		phoneNum: String(req.body.phoneNum),
		birth: new Date(req.body.birth),
		nickname: String(req.body.nickname)
	}

	const hash =  await createHashedPassword(req.body.password);
	userInfo.password = hash.hashedPassword;
	userInfo.salt = hash.salt;
	
	try {
		const result = await prisma.user.create({
			data: userInfo
		})
		return  res.json({ opcode: OPCODE.SUCCESS, result });;
		
	} catch (error) {
		console.log(error);
        next(error);
	}
}

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