import { PrismaClient } from "@prisma/client";
import planModel from "../models/planModel";

const prisma = new PrismaClient();

export const createPlan = async (req, res) => {
	let plan = {
		planName: req.body.planName,
		repepitionType: req.body.repepitionType,
		dailyId: req.body.dailyId,
		categoryId: req.body.categoryId
	}

	try {
		const resultPlan = await planModel.createPlan(plan);
		res.send(resultPlan);
		
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