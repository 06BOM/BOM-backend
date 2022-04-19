import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();


export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
	let plan = {
		planName: String(req.body.planName),
		repetitionType: parseInt(String(req.body.repetitionType)),
		dailyId: parseInt(String(req.body.dailyId)),
		categoryId: parseInt(String(req.body.categoryId))
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


export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
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


export const changeCheckToTrue = async (req: Request, res: Response, next: NextFunction) => {
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


export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
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


export const getDailyStudyTime = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	let totalTime = 0;

	try {
		const { dailyId } = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date: date },
					{ userId: userId }
				]
			}
		});

		const planTimes = await prisma.plan.findMany({ 
			where: { dailyId: dailyId },
			select: { time: true }
		});

		planTimes.map(time => {
			totalTime += time.time;
		});

		return res.status(200).json({ totalTime: totalTime });

	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const getWeeklyAverageStudyTime = async (req: Request, res: Response, next: NextFunction) => {
	const toDate = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	const day = toDate.getDay();	// [0:SUN, 1:MON, 2:TUS, 3:WED, 4:THU, 5:FRI, 6: SAT]
	let fromDate = new Date(String(req.query.date));
	let i, weeklyDailyIds, totalTime = 0, weeklyPlanTimes, averageTime;

	try {
		if(day === 0) {
			fromDate.setDate(fromDate.getDate() - 6);
			console.log("fromDate1: ", fromDate);
			weeklyDailyIds = await prisma.daily.findMany({
				where: {
					AND: [
						{ date: {
							lte: toDate,
							gte: fromDate
						}},
						{ userId }
				]},
				select: { dailyId: true }
			});

		} else {
			fromDate.setDate(fromDate.getDate() - (day - 1));
			console.log("fromDate2: ", fromDate);
			weeklyDailyIds = await prisma.daily.findMany({
				where: {
					AND: [
						{ date: {
							lte: toDate,
							gte: fromDate
						}},
						{ userId }
				]},
				select: { dailyId: true }
			});
		}

		for(i = 0; i < weeklyDailyIds.length; i++){
			weeklyPlanTimes = await prisma.plan.findMany({
				where: { dailyId: weeklyDailyIds[i].dailyId },
				select: { time: true }
			})

			weeklyPlanTimes.map(time => {
				totalTime += time.time;
			})
		}

		averageTime = totalTime / 7;
		return res.json({ opcode: OPCODE.SUCCESS, averageTime: averageTime });

	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const getMonthlyAverageStudyTime = async (req: Request, res: Response, next: NextFunction) => {
	const toDate = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	const fromDate = new Date(String(req.query.date));
	let i, totalTime: number = 0, monthlyDailyIds, monthlyPlanTimes, averageTime;

	const year = toDate.getFullYear();
	const month = toDate.getMonth();
	const numDays: number = new Date(year, month + 1, 0).getDate();

	try { 
		fromDate.setDate(1);
		monthlyDailyIds = await prisma.daily.findMany({
			where: {
				AND: [
					{ date: {
						lte: toDate,
						gte: fromDate
					}},
					{ userId }
			]},
			select: { dailyId: true }
		});

		for(i = 0; i < monthlyDailyIds.length; i++){
			monthlyPlanTimes = await prisma.plan.findMany({
				where: { dailyId: monthlyDailyIds[i].dailyId },
				select: { time: true }
			})

			monthlyPlanTimes.map(time => {
				totalTime += time.time;
			})
		}
		
		averageTime = totalTime / numDays;
		return res.json({ opcode: OPCODE.SUCCESS, averageTime: averageTime });
	

	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const handleStar = async (req: Request, res: Response, next: NextFunction) => {
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

export const getDailyStar = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));

	try {
		const { obtainedStar } = await prisma.daily.findFirst({
			where: {
				AND: [
					{ date },
					{ userId: userId }
				]
			}
		});

		return res.json({ opcode: OPCODE.SUCCESS, star: obtainedStar });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getWeeklyStar = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	const flag = date.getDay();
	// const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // [0, 1, 2, 3, 4, 5, 6]

	let date2 = new Date(String(req.query.date));
	let sum = 0;
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

export const getWeeklyTime = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	const flag = date.getDay();

	let date2 = new Date(String(req.query.date));
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


export const getMonthlyStar = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));

	let date2 = new Date(String(req.query.date));
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

export const getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));	
	
	try {
		const { dailyId } = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date },
					{ userId: userId }
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

export const getCompletedPlans = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	
	try {
		const { dailyId } = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date },
					{ userId: userId }
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

export const getIncompletePlans = async (req: Request, res: Response, next: NextFunction) => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));	

	try {
		const { dailyId } = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date },
					{ userId: userId }
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