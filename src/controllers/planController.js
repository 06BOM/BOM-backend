import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";

const prisma = new PrismaClient();


export const createPlan = async (req, res, next) => {
	let plan = {
		planName: req.body.planName,
		repetitionType: req.body.repetitionType,
		dailyId: req.body.dailyId,
		categoryId: req.body.categoryId
	}
	try {
		const resultPlan = await prisma.plan.create({
            data: plan
        });

		return res.status(200).json(resultPlan);
		
	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const updatePlan = async (req, res, next) => {
	let plan = {
		planName: req.body.planName,
		repetitionType: req.body.repetitionType,
		dailyId: req.body.dailyId,
		categoryId: req.body.categoryId
	}
	let planId = parseInt(req.params.planId);

	try {
		const resultPlan = await prisma.plan.update({
            where: {
                planId: planId
            },
            data: plan
        })

		return res.status(200).json(resultPlan);

	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const changeCheckToTrue = async (req, res, next) => {
	let planId = parseInt(req.params.planId);

	try {
		const result = await prisma.plan.update({
            where: {
                planId: planId
            },
            data: {
                check: true
            }
        })

		return res.sendStatus(200);
		//return res.status(200).json(result);

	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const deletePlan = async (req, res, next) => {
	let planId = parseInt(req.params.planId);

	try {
		const result =  await prisma.plan.delete({
            where: {
                planId: planId,
            }
        });

		return res.sendStatus(200);

	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const handleStar = async (req, res, next) => {
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

		return res.sendStatus(200);
	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const getDailyStar = async (req, res, next) => {
	const date = req.query.date;
	const userId = req.query.userId;

	try {
		const { obtainedStar } = await prisma.daily.findFirst({
			where: {
				AND: [
					{ date },
					{ userId: parseInt(userId) }
				]
			}
		});

		return res.json({ opcode: OPCODE.SUCCESS, star: obtainedStar });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getWeeklyStar = async (req, res, next) => {
	const date = new Date(req.query.date);
	const userId = parseInt(req.query.userId);
	const flag = date.getDay();
	// const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // [0, 1, 2, 3, 4, 5, 6]

	let date2 = new Date(req.query.date);

	let days;

	try {
		if(flag === 0) { // sunday
			date2.setDate(date2.getDate() - 6);
			days = await prisma.daily.findMany({
				where: {
					AND: [
						{
							date: {
							lte: date,
							gte: date2
							} 
						},
						{
							userId
						}
					]
				}
			});
		} else {
			date2.setDate(date2.getDate() - (flag - 1));
			days = await prisma.daily.findMany({
				where: {
					AND: [
						{
							date: {
							lte: date,
							gte: date2
							}
						},
						{
							userId
						}
					]	
				}
			});
		}

		days.map(day => {
			sum += day.obtainedStar;
		});
		return res.json({ opcode: OPCODE.SUCCESS, stars: sum });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getWeeklyTime = async (req, res, next) => {
	const date = new Date(req.query.date);
	const userId = Number(req.query.userId);
	const flag = date.getDay();

	let date2 = new Date(req.query.date);
	let weekPlanDailyId, weekPlanTime, i, j;
	let timeSum = new Array(weekPlanDailyId);

	try {
		if(flag === 0) { // sunday
			date2.setDate(date2.getDate() - 6);
			weekPlanDailyId = await prisma.daily.findMany({
				where: {
					AND: [
						{
							date: {
							lte: date,
							gte: date2
							} 
						},
						{
							userId
						}
					]
				},
				select:{
					date: true,
					dailyId: true
				}
			});
		} else {
			date2.setDate(date2.getDate() - (flag - 1));
			weekPlanDailyId = await prisma.daily.findMany({
				where: {
					AND: [
						{
							date: {
							lte: date,
							gte: date2
							}
						},
						{
							userId
						}
					]	
				},
				select:{
					date: true,
					dailyId: true
				}
			});
		}

		for(j=0; j<7; j++){
			timeSum[j]=0;
		}

		for(i=0; i < weekPlanDailyId.length; i++){
			weekPlanTime = await prisma.plan.findMany({
				where: {
					dailyId: weekPlanDailyId[i].dailyId
				},
				select: {
					time: true
				}
			});
			
			weekPlanTime.map(time=>{
				timeSum[weekPlanDailyId[i].date.getDay()] += time.time;
			})
			
			console.log(weekPlanTime);
		}
		console.log(timeSum);
		return res.json({opcode: OPCODE.SUCCESS, });

	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const getMonthlyStar = async (req, res, next) => {
	const date = new Date(req.query.date);
	const userId = parseInt(req.query.userId);

	let date2 = new Date(req.query.date);
	let sum = 0;
	let days;

	try { 
		date2.setDate(1);
		days = await prisma.daily.findMany({
			where: {
				AND: [
					{
						date: {
							lte: date,
							gte: date2
						} 
					},
					{
						userId
					}
				]
			}
		});

		days.map(day => {
			sum += day.obtainedStar;
		});
		return res.json({ opcode: OPCODE.SUCCESS, stars: sum });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getAllPlans = async (req, res, next) => {
	const date = new Date(req.query.date);
	const userId = parseInt(req.query.userId);	
	
	try {
		const { dailyId } = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date },
					{ userId: parseInt(userId) }
				]
			}
		});	
		const plans = await prisma.plan.findMany({
			where: {
				dailyId				
			}
		});	
		return res.json({opcode: OPCODE.SUCCESS, plans});
	} catch(error) {
		console.log(error);
		next(error);
	}	
}

export const getCompletedPlans = async (req, res, next) => {
	const date = new Date(req.query.date);
	const userId = parseInt(req.query.userId);
	
	try {
		const { dailyId } = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date },
					{ userId: parseInt(userId) }
				]
			}
		});	
		const plans = await prisma.plan.findMany({
			where: {
				AND: [
					{ dailyId },
					{ check: true }
				]				
			}
		});	
		return res.json({opcode: OPCODE.SUCCESS, plans});
	} catch(error) {
		console.log(error);
		next(error);
	}		
}

export const getIncompletePlans = async (req, res, next) => {
	const date = new Date(req.query.date);
	const userId = parseInt(req.query.userId);	

	try {
		const { dailyId } = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date },
					{ userId: parseInt(userId) }
				]
			}
		});	
		const plans = await prisma.plan.findMany({
			where: {
				AND: [
					{ dailyId },
					{ check: false }
				]				
			}
		});	
		return res.json({opcode: OPCODE.SUCCESS, plans});
	} catch(error) {
		console.log(error);
		next(error);
	}
}