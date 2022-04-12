import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteUser = async (req, res) => {
	const userId = req.userId;

	try {
		await prisma.user.delete({
			where: {
				userId	
			},
		});
		res.sendStatus(200);
	} catch(error) {
		console.log(error);
	}
};

export const handleUser = async (req, res) => {
	const userId = req.userId;
	try {
		await prisma.user.delete({
			where: {
				userId	
			},
            //set 선택으로 req의 type에 따라 data를 변경해주는 과정 필요.
		});
		res.sendStatus(200);
	} catch(error) {
		console.log(error);
	}
};

export const getUser = async (req, res) => {
	const userId = req.userId;
	try {
		await prisma.user.findUnique({
			where: {
				userId	
			}
		});
		res.sendStatus(200);
	} catch(error) {
		console.log(error);
	}
};

export const signin = async (req, res) => {
	const emailId = req.body.emailId;
    const userName = req.body.userName;
    const password = req.body.password;
    const nickname = req.body.nickname;
    const birth = req.body.birth;
    const phoneNum = req.body.phoneNum;
    const grade = req.body.grade;

	try {
		await prisma.user.create({
			data: {
				emailId,
                userName,
                password,
                nickname,
                birth,
                phoneNum,
                grade,
			},
		});
		res.sendStatus(200);
	} catch(error) {
		console.log(error);
	}
};

