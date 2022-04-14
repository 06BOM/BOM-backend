import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

		return res.sendStatus(200);
	} catch(error) {
		console.log(error);
	}
};

export const getDailyStar = async (req, res) => {
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

		return res.json({ star: obtainedStar });
	} catch(error) {
		console.log(error);
	}
}

export const getWeeklyStar = async (req, res) => {
	const date = new Date(req.query.date);
	const userId = parseInt(req.query.userId);
	const flag = date.getDay();
	// const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // [0, 1, 2, 3, 4, 5, 6]

	let date2 = new Date(req.query.date);
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
			date2.setDate(date2.getDate() - ( flag - 1));
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
		return res.json({ stars: sum });
	} catch(error) {
		console.log(error);
	}
}

export const getMonthlyStar = async (req, res) => {
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
		return res.json({ stars: sum });
	} catch(error) {
		console.log(error);
	}
}

export const getAllPlans = async (req, res) => {
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
		return res.json(plans);
	} catch(error) {
		console.log(error);
	}	
}

export const getCompletedPlans = async (req, res) => {
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
		return res.json(plans);
	} catch(error) {
		console.log(error);
	}		
}

export const getIncompletePlans = async (req, res) => {
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
		return res.json(plans);
	} catch(error) {
		console.log(error);
	}
}