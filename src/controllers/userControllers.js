const userModel = require('../models/userModel');

export const signin = async (req, res) => {
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
		const newUser = await userModel.createUser(user);
		console.log(user);
		return res.status(200).json(newUser);

	} catch(error) {
		console.log(error);
	}
};

export const findUser = async (req, res) => {
	let userId = req.params.userId;

	try {
		const userData = await userModel.getUser(Number(userId));
		return res.status(200).json(userData);

	} catch(error) {
		console.log(error);
	}
};

export const deleteUser = async (req, res) => {
	let userId = req.params.userId;

	try {
		await userModel.deleteUser(Number(userId));
		return res.sendStatus(200);

	} catch(error) {
		console.log(error);
	}
};

export const modifyUser = async (req, res) => {
	let userInfo = {
		nickname: req.body.nickname,
		password: req.body.password,
		phoneNum: req.body.phoneNum,
		introduction: req.body.introduction,
		star: req.body.star,
		lock: req.body.lock,
		lockFreeDate: req.body.lockFreeDate
	}
	userInfo.lockFreeDate = new Date(userInfo.lockFreeDate);
	
	let userId = req.params.userId;

	try {
		const userData = await userModel.updateUser(userInfo, Number(userId));
		return res.status(200).json(userData);

	} catch(error) {
		console.log(error);
	}
};