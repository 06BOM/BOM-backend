//const userModel = require('../models/userModel');
import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
const prisma = new PrismaClient();

export const signin = async (req, res, next) => {
	let user = {
		emailId: req.body.emailId,
		userName: req.body.userName,
		password: req.body.password,
		nickname: req.body.nickname,
		birth: req.body.birth,
		phoneNum: req.body.phoneNum,
		grade: req.body.grade
	}
	user.birth = new Date(user.birth);

	try {
		const createUserResult = await prisma.user.create({
			data: user
		});
		return res.json({opcode:OPCODE.SUCCESS, createUserResult});

	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const getUser = async (req, res, next) => {
	let userId = Number(req.params.userId);
	try {
		const getUserResult = await prisma.user.findUnique({
            where:{
                userId: userId
            },
        });
		return res.json({opcode:OPCODE.SUCCESS, getUserResult});

	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	let userId = Number(req.params.userId);

	try {
		await prisma.user.delete({
            where:{
				userId: userId
            },
        });
		return res.json({opcode:OPCODE.SUCCESS});

	} catch(error) {
		console.log(error);
		next(error);
	}
};


export const modifyUser = async (req, res, next) => {
	let userInfo = {
		nickname: req.body.nickname,
		phoneNum: req.body.phoneNum,
		introduction: req.body.introduction,
		grade: req.body.grade
	}

	let userId = Number(req.params.userId);

	try {
		const modifyUserResult = await prisma.user.update({
            where:{
                userId: userId
            },
            data: userInfo
        });
		
		return res.json({opcode:OPCODE.SUCCESS, modifyUserResult});

	} catch(error) {
		console.log(error);
		next(error);
	}
};
