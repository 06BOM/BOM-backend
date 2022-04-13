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

