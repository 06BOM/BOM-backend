import { PrismaClient } from "@prisma/client";
import { insertPlan, removePlanById, updatePlan, updateCheck } from "../models/planModel";

const prisma = new PrismaClient();


export const createPlan = async (req, res) => {
	let plan = {
		planName: req.body.planName,
		repetitionType: req.body.repetitionType,
		dailyId: req.body.dailyId,
		categoryId: req.body.categoryId
	}
	try {
		const resultPlan = await insertPlan(plan);
		return res.status(200).json(resultPlan);
		
	} catch(error) {
		console.log(error);
	}
}


export const modifyPlan = async (req, res) => {
	let plan = {
		planName: req.body.planName,
		repetitionType: req.body.repetitionType,
		dailyId: req.body.dailyId,
		categoryId: req.body.categoryId
	}
	let planId = req.params.planId;

	try {
		const resultPlan = await updatePlan(plan, Number(planId));
		return res.status(200).json(resultPlan);
	} catch(error) {
		console.log(error);
	}
}


export const changeCheckToTrue = async (req, res) => {
	let planId = req.params.planId;

	try {
		const result = await updateCheck(Number(planId));
		//return res.sensStatus(200);
		return res.status(200).json(result);
	} catch(error) {
		console.log(error);
	}
}


export const deletePlan = async (req, res) => {
	let { planId } = req.params;

	try {
		const result = await removePlanById(Number(planId));
		return res.sendStatus(200);

	} catch(error) {
		console.log(error);
	}
}


export const handleStar = async (req, res) => {
	const userId = req.body.userId;
	const dailyId = req.body.dailyId;

	try {
		const user = await prisma.user.findUnique({ where: { userId } });
		const daily = await prisma.daily.findUnique({ where: { dailyId } });

		await prisma.user.update({
			where: {
				userId	
			},
			data: {
				star: user.star + 1
			}
		});

		await prisma.daily.update({
			where: {
				dailyId	
			},
			data: {
				obtainedStar: daily.obtainedStar + 1
			}
		});

		res.sendStatus(200);
	} catch(error) {
		console.log(error);
	}
};