import { PrismaClient } from "@prisma/client";
import { OPCODE } from "../tools";
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

const deleteRepitition = async (dPlanId, dUserId, deleteDayId) => {
	const planId = dPlanId;
	const userId = dUserId;
	const dayId = Number(deleteDayId);
	let date, i, date2;

	try {
		const getPlanInfo = await prisma.plan.findFirst({
			where: { planId: planId },
			select: {
				planName: true,
				daily: true
			}
		})
		
		date = new Date(getPlanInfo.daily.date);
		date.setUTCHours(0, 0, 0); 
		date.setDate( date.getDate() + 1);

		const getDates = await prisma.daily.findMany({
			where: {
				AND: [
					{ userId: userId },
					{ date: { gte: date } }
				]
			},
			select: { date: true }
		})

		for (i = 0 ; i < getDates.length ; i++) {
			date2 = new Date(getDates[i].date);

			if( dayId === date2.getDay()) {

				const deleteRepititionPlans = await prisma.plan.deleteMany({
					where: {
						AND: [
							{ planName: getPlanInfo.planName },
							{ daily: {		
								date: date2
								}
							},
							{ daily: {
								userId: userId
							}}
						]
					}
				})
			}
		}
		
		const deletePlanDay = await prisma.planDay.deleteMany({
			where: {
				AND: [
					{ dayId: dayId },
					{ planName: getPlanInfo.planName },
					{ userId: userId }
				]
			}
		})

		return 0;

	} catch (error) {
		console.log(error);
	}
}

export const getRepititionValidity = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	
	let planId = Number(req.params.planId);
	let date, day;

	try {
		const getPlanInfo = await prisma.plan.findUnique({
			where: { planId: planId },
			select: { 
				planName: true,
				dailyId: true }
		});

		const getDailyInfo = await prisma.daily.findUnique({
			where: { dailyId: getPlanInfo.dailyId }
		})

		date = new Date(getDailyInfo.date);
		day = date.getDay();
		
		const getValidity = await prisma.planDay.findMany({
			where: {
				AND: [
					{ dayId: day },
					{ planName: getPlanInfo.planName },
					{ userId: getDailyInfo.userId }
				]
			},
			select: {
				year: true,
				month: true,
				day: true
			}
		})
		
		return res.json({ opcode: OPCODE.SUCCESS, getValidity });

	} catch (error) {
		console.log(error);
		next(error);
	}
}

export const getUserId = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	
	let planId = Number(req.params.planId);
		
	try {
		//const r = deleteRepitition(1, 1, 1);	//test

		const getDailyId = await prisma.plan.findUnique({
			where: { 
				planId: planId	
			},
			select:{
				dailyId: true
			}
		});

		const getUser = await prisma.daily.findUnique({
			where: {
				dailyId: getDailyId.dailyId
			},
			select:{
				userId: true
			}
		});


		return res.json({ opcode: OPCODE.SUCCESS, userId : getUser.userId });
		
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getPlanData = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	
	let planId = Number(req.params.planId);
		
	try {
		const result = await prisma.plan.findUnique({
			where: { 
				planId: planId	
			},
			select:{
				planName: true,
				time: true,
				check: true,
				category: true
			}
		});
		console.log({ opcode: OPCODE.SUCCESS, result });
		return res.json({ opcode: OPCODE.SUCCESS, result });
		
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const createPlan = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const userId = Number(req.body.userId);
	const date = new Date((req.body.date));
	let today = new Date(JSON.parse(JSON.stringify(date)));
	let currentDay = new Date(JSON.parse(JSON.stringify(date)));
	let year = 0, month = 0, day  = 0;

	today.setUTCHours(0, 0, 0);
	currentDay.setUTCHours(0, 0, 0);
	const todayy = new Date(JSON.parse(JSON.stringify(today)));

	// repitition table ????????? ?????? ????????? ?????? ????????????

	if (req.body.year && req.body.month && req.body.day) {
		year = parseInt(String(req.body.year));
		month = parseInt(String(req.body.month - 1));
		day = parseInt(String(req.body.day + 1));

		currentDay.setFullYear(year);
		currentDay.setMonth(month);
		currentDay.setDate(day);
	} else {
		currentDay.setFullYear(currentDay.getFullYear() + 1);
	}

	const days = req.body.days; // ?????? [0, 0, 0, 0, 0, 0, 0] ????????? ?????????

	let plan = {
		planName: String(req.body.planName),
		repetitionType: req.body.repetitionType? parseInt(String(req.body.repetitionType)) : 0,
		dailyId: 0,
		categoryId: parseInt(String(req.body.categoryId))
	}

	let resultPlan;

	try {
		if (plan.repetitionType === 0) {
			const getDaily = await prisma.daily.findFirst({
				where: {
					AND: [
						{ date: date },
						{ userId: userId }
					]
				},
				select:{ dailyId: true }
			});
		
			if(getDaily === null) {
				const createDaily = await prisma.daily.create({
					data: { date: date, userId: userId }
				});

				plan.dailyId = createDaily.dailyId;

			} else {
				plan.dailyId = getDaily.dailyId;
			}

			resultPlan = await prisma.plan.create({
				data: plan
			});

		} else if(plan.repetitionType === 1) { // ?????? ??????
			while (1) {
				
				const getDaily = await prisma.daily.findFirst({
					where: {
						AND: [
							{ date: today },
							{ userId: userId }
						]
					},
					select:{ dailyId: true }
				});
			
				if (getDaily === null) {
					const createDaily = await prisma.daily.create({
						data: { date: today, userId: userId }
					});
	
					plan.dailyId = createDaily.dailyId;	
				} else {
					plan.dailyId = getDaily.dailyId;
				}
				
				if (Number(todayy) === Number(today)) {
					resultPlan = await prisma.plan.create({
						data: plan
					});
				} else {
					await prisma.plan.create({
						data: plan
					});
				}

				today.setUTCDate(today.getDate() + 1);
				if (Number(today) === Number(currentDay)) {
					break;	
				}
			}
		} else { // ?????? ??????
			while (1) {
				const getDaily = await prisma.daily.findFirst({
					where: {
						AND: [
							{ date: today },
							{ userId: userId }
						]
					},
					select:{ dailyId: true }
				});
			
				if (getDaily === null) {
					const createDaily = await prisma.daily.create({
						data: { date: today, userId: userId }
					});
					plan.dailyId = createDaily.dailyId;	
				} else {
					plan.dailyId = getDaily.dailyId;
				}
				
				if (Number(todayy) === Number(today)) {					
					resultPlan = await prisma.plan.create({
						data: plan
					});

					for (let i = 0; i < days.length; i++)
					{
						if (days[i]) {
							await prisma.planDay.create({
								data: {
									planId: resultPlan.planId,
									planName: resultPlan.planName,
									year: year,
									month: month,
									day: day,
									dayId: i,
									userId: userId
								}
							});		
						}
					}

				} else if (days[today.getDay()]) {
					const result = await prisma.plan.create({
						data: plan
					});

					for (let i = 0; i < days.length; i++)
					{
						if (days[i]) {
							await prisma.planDay.create({
								data: {
									planId: result.planId,
									planName: result.planName,
									year: year,
									month: month,
									day: day,
									dayId: i,
									userId: userId
								}
							});		
						}
					}
				}

				today.setUTCDate(today.getDate() + 1);
				if (Number(today) === Number(currentDay)) {
					break;	
				}
			}
		}
		console.log({ opcode: OPCODE.SUCCESS, resultPlan });
		return res.json({ opcode: OPCODE.SUCCESS, resultPlan });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const updatePlan = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	
	let planId = parseInt(req.params.planId);

	const getData = await prisma.plan.findUnique({
		where: { 
			planId: planId	
		}
	});
	
	let plan = {
		planName: req.body.planName? String(req.body.planName): getData.planName,
		categoryId: req.body.categoryId? parseInt(String(req.body.categoryId)): getData.categoryId,
		repetitionType: req.body.repetitionType,
		check:req.body.check,
		time: req.body.time? parseInt(String(req.body.time)): getData.time
	};

	let createPlan = {
		planName: req.body.planName? String(req.body.planName): getData.planName,
		dailyId: getData.dailyId,
		categoryId: req.body.categoryId? parseInt(String(req.body.categoryId)): Number(getData.categoryId),
		repetitionType: req.body.repetitionType,
	};
		
	const getDate = await prisma.daily.findUnique({
		where:{
			dailyId: getData.dailyId
		},
		select: {
			date: true
		}
	});

    const getUser = await prisma.daily.findUnique({
		where: {
			dailyId: getData.dailyId
		},
		select:{
			userId: true
		}
	});


	let today = new Date(JSON.parse(JSON.stringify(getDate.date)));
	let currentDay = new Date(JSON.parse(JSON.stringify(getDate.date)));
	let year = 0, month = 0, day = 0;
	today.setUTCHours(0, 0, 0);
	currentDay.setUTCHours(0, 0, 0);
	const todayy = new Date(JSON.parse(JSON.stringify(today)));
	const days = req.body.days;
	// repitition table ????????? ?????? ????????? ?????? ????????????

	if (req.body.year && req.body.month && req.body.day) {
		year = parseInt(String(req.body.year));
		month = parseInt(String(req.body.month - 1));
		day = parseInt(String(req.body.day + 1));

		currentDay.setFullYear(year);
		currentDay.setMonth(month);
		currentDay.setDate(day);
	} else {
		currentDay.setFullYear(currentDay.getFullYear() + 1);
	}

	
	const originRepititionType = await prisma.plan.findUnique({
		where:{
			planId: planId
		},
		select:{
			repetitionType:true
		}
	})

	let resultPlan;

	try {
		/*
        RepititionType??? ??????????????? ??? ??? 
		0->1 ??????x => ?????? ?????? (O)
		-> ?????? ?????? ?????? plan ??????
		0->2 ??????x => ?????? ??????
		-> ?????? ?????? ????????? day??? ?????? plan ??????
		1->0 ?????? ?????? => ??????x
		-> ????????? plan ????????? ?????? ????????? ?????? ?????? plan ??????
		1->2 ?????? ?????? => ?????? ??????
		-> ????????? ????????? ????????? ?????? plan??? ??????
		2->0 ?????? ?????? => ??????x
		-> ????????? plan ????????? ?????? ?????????  ?????? ?????? plan ??????
		2->1 ?????? ?????? => ?????? ??????
		-> ???????????? ?????? day??? ????????? ?????? ?????? create plan
		2->2 ?????? ?????? => ?????? ??????(?????? ??????)
		-> ??? ?????? ????????? ???????????? ????????? ?????? plan??? ???????????? ?????? ????????? ????????? plan ??????
		*/
		console.log(originRepititionType.repetitionType);
		console.log("input repetitionType Data : "+plan.repetitionType);

		

		if(plan.repetitionType===0||plan.repetitionType===1||plan.repetitionType===2){//repititionType??? ????????? ?????? ???
			switch(originRepititionType.repetitionType){
				case 0 :
					{
						if(plan.repetitionType===1){//0->1 default to daily repeat
							console.log("0->1 default to daily repeat");
							while (1) {	
								const getDaily = await prisma.daily.findFirst({
									where: {
										AND: [
											{ date: today },
											{ userId: getUser.userId }
										]
									},
									select:{ dailyId: true }
								})
								console.log(getDaily);

								if (getDaily === null) {
									const createDaily = await prisma.daily.create({
										data: { date: today, userId: getUser.userId }
									});
									createPlan.dailyId = createDaily.dailyId;	

								} else {
									createPlan.dailyId = getDaily.dailyId;
								}
								
								if (Number(todayy) === Number(today)) {
									await prisma.plan.update({
										where: {
											planId: planId
										},
										data: plan
									})

									await prisma.plan.update({
										where: {
											planId: planId
										},
										data: createPlan
									})
								}
								else {
									await prisma.plan.create({
										data: createPlan
									});
								}
								today.setUTCDate(today.getDate() + 1);
								if (Number(today) === Number(currentDay)) {
									break;	
								}
							}
							break;
						}
						else if(plan.repetitionType===2){//0->2 default to weekly repeat
							console.log("0->2 default to weekly repeat");

							while (1) {
								const getDaily = await prisma.daily.findFirst({
									where: {
										AND: [
											{ date: today },
											{ userId: getUser.userId }
										]
									},
									select:{ dailyId: true }
								});
							
								if (Number(todayy) === Number(today)) {
									const PlanData = await prisma.plan.update({
										where: {
											planId: planId
										},
										data: plan
									})
									for (let i = 0; i < days.length; i++)
									{
										if (days[i]) {
											await prisma.planDay.create({
												data: {
													planId: resultPlan.planId,
													planName: resultPlan.planName,
													year: year,
													month: month,
													day: day,
													dayId: i,
													userId: getUser.userId
												}
											});		
										}
									}
								} else if (days[today.getDay()]) {
									if (getDaily === null) {
										const createDaily = await prisma.daily.create({
											data: { date: today, userId: getUser.userId }
										});
										getData.dailyId = createDaily.dailyId;	
									} else {
										createPlan.dailyId = getDaily.dailyId;
									}
									plan.time = 0;

									resultPlan = await prisma.plan.create({
										data: createPlan
									});

									for (let i = 0; i < days.length; i++)
									{
										if (days[i]) {
											await prisma.planDay.create({
												data: {
													planId: resultPlan.planId,
													planName: resultPlan.planName,
													year: year,
													month: month,
													day: day,
													dayId: i,
													userId: getUser.userId
												}
											});		
										}
									}
								}

								today.setUTCDate(today.getDate() + 1);
								if (Number(today) === Number(currentDay)) {
									break;	
								}
							}
							break;
						}
						else{//0->0 nothing happened
							console.log("0->0 nothing happened");
							break;
						}
					}
	
				case 1 :
					{
						if(plan.repetitionType===1){//1->1 nothing happened
							console.log("1->1 change date");
							//?????? ?????? day??? ????????? ?????? ????????????
							for(let i=-0; i<7; i++){
								deleteRepitition(planId, getUser.userId, i);
							}
							
							while (1) {	
								const getDaily = await prisma.daily.findFirst({
									where: {
										AND: [
											{ date: today },
											{ userId: getUser.userId }
										]
									},
									select:{ dailyId: true }
								})
								
								if (getDaily === null) {
									const createDaily = await prisma.daily.create({
										data: { date: today, userId: getUser.userId }
									});
									createPlan.dailyId = createDaily.dailyId;	

								} else {
									createPlan.dailyId = getDaily.dailyId;
								}
								
								if (Number(todayy) === Number(today)) {
									await prisma.plan.update({
										where: {
											planId: planId
										},
										data: plan
									})
								}
								else {
										await prisma.plan.create({
										data: createPlan
									});
								}
								today.setUTCDate(today.getDate() + 1);
								if (Number(today) === Number(currentDay)) {
									break;	
								}
							}
							break;
						}
						else if(plan.repetitionType===2){//1->2 daily to weekly
							console.log("1->2 daily to weekly");
							
							//?????? ???????????? ????????? ?????? ??? ?????????
							for(let i=-0; i<7; i++){
								deleteRepitition(planId, getUser.userId, i);
							}

							const getUpdateDailyId = await prisma.daily.findMany({
								where: {
									date:{
										lte: getDate.date
									}
								},
								select:{
									dailyId: true
								}
							}) 
							
							for(let i = 0; i < getUpdateDailyId.length; i++){
								await prisma.plan.updateMany({
									where: {
										AND: [
											{dailyId: getUpdateDailyId[i].dailyId},
											{planName: getData.planName}
										]
									},
									data:{
										repetitionType: plan.repetitionType
									}
								})
							}

							//????????? day??? ???????????? ?????? ??????
							while (1) {
								const getDaily = await prisma.daily.findFirst({
									where: {
										AND: [
											{ date: today },
											{ userId: getUser.userId }
										]
									},
									select:{ dailyId: true }
								});
							
								if (Number(todayy) === Number(today)) {
									const PlanData = await prisma.plan.update({
										where: {
											planId: planId
										},
										data: plan
									});

									for (let i = 0; i < days.length; i++)
									{
										if (days[i]) {
											await prisma.planDay.create({
												data: {
													planId: resultPlan.planId,
													planName: resultPlan.planName,
													year: year,
													month: month,
													day: day,
													dayId: i,
													userId: getUser.userId
												}
											});		
										}
									}
								} else if (days[today.getDay()]) {
									if (getDaily === null) {
										const createDaily = await prisma.daily.create({
											data: { date: today, userId: getUser.userId }
										});
										createPlan.dailyId = createDaily.dailyId;	
									} else {
										createPlan.dailyId = getDaily.dailyId;
									}
									resultPlan = await prisma.plan.create({
										data: createPlan
									});

									for (let i = 0; i < days.length; i++)
									{
										if (days[i]) {
											await prisma.planDay.create({
												data: {
													planId: resultPlan.planId,
													planName: resultPlan.planName,
													year: year,
													month: month,
													day: day,
													dayId: i,
													userId: getUser.userId
												}
											});		
										}
									}
								}
				
								today.setUTCDate(today.getDate() + 1);
								
								if (Number(today) === Number(currentDay)) {
									break;	
								}
							}
							break;
						}

						else{//1->0 daily to default
							console.log("1->0 daily to default");
							for(let i=-0; i<7; i++){
								deleteRepitition(planId, getUser.userId, i);
							}

							const getUpdateDailyId = await prisma.daily.findMany({
								where: {
									date:{
										lte: getDate.date
									}
								},
								select:{
									dailyId: true
								}
							}) 
							
							for(let i = 0; i < getUpdateDailyId.length; i++){
								await prisma.plan.updateMany({
									where:{
										AND:[
											{dailyId: getUpdateDailyId[i].dailyId},
											{planName: getData.planName}
										]
									},
									data:{
										repetitionType: plan.repetitionType
									}
								})
							}
							break;
						}
					}	
	
				case 2 :
					{
						if(plan.repetitionType===1){//2->1 weekly to daily
							console.log("2->1 weekly to daily");
							//weeklydata??? ?????? ????????????
							for(let i=-0; i<7; i++){
								deleteRepitition(planId, getUser.userId, i);
							}

							const getUpdateDailyId = await prisma.daily.findMany({
								where: {
									date:{
										lte: getDate.date
									}
								},
								select:{
									dailyId: true
								}
							}) 
							
							for(let i = 0; i < getUpdateDailyId.length; i++){
								await prisma.plan.updateMany({
									where:{
										AND:[
											{ dailyId: getUpdateDailyId[i].dailyId },
											{ planName: getData.planName }
										]
									},
									data:{
										repetitionType: plan.repetitionType
									}
								})
							}
							//daily repeat??? ???????????? ????????? ??????
							while (1) {	
								const getDaily = await prisma.daily.findFirst({
									where: {
										AND: [
											{ date: today },
											{ userId: getUser.userId }
										]
									},
									select:{ dailyId: true }
								})
								
								if (getDaily === null) {
									const createDaily = await prisma.daily.create({
										data: { date: today, userId: getUser.userId }
									});
									createPlan.dailyId = createDaily.dailyId;	

								} else {
									createPlan.dailyId = getDaily.dailyId;
								}
								
								if (Number(todayy) === Number(today)) {
									await prisma.plan.update({
										where: {
											planId: planId
										},
										data: plan
									})
								}
								else {
									await prisma.plan.create({
										data: createPlan
									});
								}
								today.setUTCDate(today.getDate() + 1);
								if (Number(today) === Number(currentDay)) {
									break;	
								}
							}
							break;
						}
						else if(plan.repetitionType===2){//2->2 change date
							console.log("2->2 change date");
							//?????? ?????? day??? ????????? ?????? ????????????
							for(let i=-0; i<7; i++){
								deleteRepitition(planId, getUser.userId, i);
							}
							//?????? ????????? day??? ???????????? ?????? ?????? ????????? ??????
							while (1) {
								const getDaily = await prisma.daily.findFirst({
									where: {
										AND: [
											{ date: today },
											{ userId: getUser.userId }
										]
									},
									select:{ dailyId: true }
								});
							
								if (Number(todayy) === Number(today)) {
									const PlanData = await prisma.plan.update({
										where: {
											planId: planId
										},
										data: plan
									})
									for (let i = 0; i < days.length; i++)
									{
										if (days[i]) {
											await prisma.planDay.create({
												data: {
													planId: PlanData.planId,
													planName: PlanData.planName,
													year: year,
													month: month,
													day: day,
													dayId: i,
													userId: getUser.userId
												}
											});		
										}
									}
								} else if (days[today.getDay()]) {
									
									if (getDaily === null) {
										const createDaily = await prisma.daily.create({
											data: { date: today, userId: getUser.userId }
										});
										createPlan.dailyId = createDaily.dailyId;	
									} else {
										createPlan.dailyId = getDaily.dailyId;
									}
									resultPlan = await prisma.plan.create({
										data: createPlan
									});

									for (let i = 0; i < days.length; i++)
									{
										if (days[i]) {
											await prisma.planDay.create({
												data: {
													planId: resultPlan.planId,
													planName: resultPlan.planName,
													year: year,
													month: month,
													day: day,
													dayId: i,
													userId: getUser.userId
												}
											});		
										}
									}
								}
				
								today.setUTCDate(today.getDate() + 1);
								
								if (Number(today) === Number(currentDay)) {
									break;	
								}
							}
							break;
						}
						else{//2->0 weekly repeat to default
							console.log("2->0 weekly repeat to default");

							for(let i=-0; i<7; i++){
								deleteRepitition(planId, getUser.userId, i);
							}

							const getUpdateDailyId = await prisma.daily.findMany({
								where: {
									date:{
										lte: getDate.date
									}
								},
								select:{
									dailyId: true
								}
							}) 
							
							for(let i=0; i<getUpdateDailyId.length;i++){
								await prisma.plan.updateMany({
									where:{
										AND:[
											{dailyId: getUpdateDailyId[i].dailyId},
											{planName: getData.planName}
										]
									},
									data:{
										repetitionType: plan.repetitionType
									}
								})
							}
							break;
						}
					}
			}
		}

		else{//?????? update
			resultPlan = await prisma.plan.update({
				where: {
					planId: planId
				},
				data: plan
			})
		}

		return res.json({ opcode: OPCODE.SUCCESS , resultPlan});
	
	} catch(error) {
		console.log(error);
		next(error);
	}
}


export const getPlanTime = async(req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let planId = parseInt(req.params.planId);

	try {
		const time = await prisma.plan.findUnique({
			where: { planId: planId },
			select: { time: true }
		})

		console.log({ opcode: OPCODE.SUCCESS, time: time.time });
		return res.json({ opcode: OPCODE.SUCCESS, time: time.time })

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const deletePlan = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let planId = parseInt(req.params.planId);

	try {
		const result =  await prisma.plan.delete({
            where: {
                planId: planId,
            }
        });

		return res.json({ opcode: OPCODE.SUCCESS });

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getDailyStudyTime = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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

		console.log({ opcode: OPCODE.SUCCESS, totalTime: totalTime });
		return res.json({ opcode: OPCODE.SUCCESS, totalTime: totalTime });

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getStatistic = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const date = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));

	console.log(date);

	let dailyPlanTimes, totalTime = 0;
	
	try {
		const dateDailyId = await prisma.daily.findFirst({
			where: { 
				AND: [
					{ date: date },
					{ userId: userId }
				]
			}
		});
		
		console.log(dateDailyId);

		dailyPlanTimes = await prisma.plan.groupBy({
			by: ['categoryId'], 
			where: {
				dailyId: dateDailyId.dailyId
			},
			_sum: {
				time: true
			},
			orderBy:{
				categoryId: 'asc' 
			}
		});
	
		const planTimes = await prisma.plan.findMany({ 
			where: {
				dailyId: dateDailyId.dailyId
			},
			select: { time: true }
		});

		planTimes.map(time => {
			totalTime += time.time;
		});

		dailyPlanTimes.map(cnt => {
			cnt._sum.time /= totalTime;
		})

		console.log({ opcode: OPCODE.SUCCESS, dailyPlanTimes });
		return res.json({ opcode: OPCODE.SUCCESS, dailyPlanTimes });
	}
		catch(error) {
		console.log(error);
		next(error);
	}
}

export const getWeeklyAverageStudyTime = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let toDate = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	const day = toDate.getDay();	// [0:SUN, 1:MON, 2:TUS, 3:WED, 4:THU, 5:FRI, 6: SAT]
	let fromDate = new Date(String(req.query.date));
	let i: number, weeklyDailyIds, totalTime = 0, weeklyPlanTimes, averageTime: number;

	try {
		if(day === 0) {
			fromDate.setDate(fromDate.getDate() - 6);

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
			toDate.setDate(toDate.getDate() + (7 - day)); 

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

		averageTime = parseInt(String(totalTime / 7));
		return res.json({ opcode: OPCODE.SUCCESS, averageTime: averageTime });

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getMonthlyAverageStudyTime = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	let toDate = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));
	let fromDate = new Date(String(req.query.date));
	let i: number, totalTime: number = 0, monthlyDailyIds, monthlyPlanTimes, averageTime;

	const year = toDate.getFullYear();
	const month = toDate.getMonth();
	const numDays = new Date(year, month + 1, 0).getDate();

	try { 
		fromDate.setDate(1);
		toDate.setDate(numDays);

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
		
		averageTime = parseInt(String(totalTime / numDays));
		return res.json({ opcode: OPCODE.SUCCESS, averageTime: averageTime });

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const handleStar = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const userId = req.body.userId;
	const dailyId = req.body.dailyId;

	try {
		const user = await prisma.user.findUnique({ where: { userId } });
		const daily = await prisma.daily.findUnique({ where: { dailyId } });

		const resultUser = await prisma.user.update({
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
		
		console.log({ opcode: OPCODE.SUCCESS, star: resultUser.star })
		return res.json({ opcode: OPCODE.SUCCESS });

	} catch(error) {
		console.log(error);
		next(error);
	}
};

export const getDailyStar = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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

		console.log({ opcode: OPCODE.SUCCESS, star: obtainedStar })
		return res.json({ opcode: OPCODE.SUCCESS, star: obtainedStar });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getWeeklyStar = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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

		console.log({ opcode: OPCODE.SUCCESS, stars: sum });
		return res.json({ opcode: OPCODE.SUCCESS, stars: sum });

	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getWeeklyTime = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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
		return res.json({ opcode: OPCODE.SUCCESS, timeSum });

	} 
		catch(error) {
		console.log(error);
		next(error);
	}
}

export const getMonthlyStar = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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
		console.log({ opcode: OPCODE.SUCCESS, stars: sum });
		return res.json({ opcode: OPCODE.SUCCESS, stars: sum });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getMonthlyTime = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	const toDate = new Date(String(req.query.date));
	const fromDate = new Date(String(req.query.date));
	const userId = parseInt(String(req.query.userId));

	let monthPlanDailyId, monthPlanTime, j, i;
	let timeSum = new Array(monthPlanDailyId);

	const year = toDate.getFullYear();
	const month = toDate.getMonth();
	const numDays = new Date(year, month + 1, 0).getDate();

	try { 
		fromDate.setDate(1);
		monthPlanDailyId = await prisma.daily.findMany({
			where: {
				AND: [
					{
						date: {
							lte: toDate,
							gte: fromDate
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

		console.log(monthPlanDailyId);

		for(j=0;j<numDays;j++){
			timeSum[j]=0;
		}


		for(i=0; i < monthPlanDailyId.length; i++){
			monthPlanTime = await prisma.plan.findMany({
				where: {
					dailyId: monthPlanDailyId[i].dailyId
				},
				select: {
					time: true
				}
			});	

			monthPlanTime.map(time=>{
				timeSum[monthPlanDailyId[i].date.getDate()-1] += time.time;
			})
		}
		return res.json({ opcode: OPCODE.SUCCESS, timeSum });
	} 
		catch(error) {
		console.log(error);
		next(error);
	}
}

export const getAllPlans = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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
		
		const result = await Promise.all(
				plans.map(async plan => {
				const category = await prisma.category.findUnique({
					where: {
						categoryId: plan.categoryId
					}
				});

				Object.assign(plan, category);
				return plan;
		}));

		console.log({ opcode: OPCODE.SUCCESS, result });
		return res.json({ opcode: OPCODE.SUCCESS, result });
	} catch(error) {
		console.log(error);
		next(error);
	}	
}

export const getCompletedPlans = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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
		console.log({ opcode: OPCODE.SUCCESS, plans });
		return res.json({ opcode: OPCODE.SUCCESS, plans });
	} catch(error) {
		console.log(error);
		next(error);
	}		
}

export const getIncompletePlans = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
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
		console.log({ opcode: OPCODE.SUCCESS, plans });
		return res.json({ opcode: OPCODE.SUCCESS, plans });
	} catch(error) {
		console.log(error);
		next(error);
	}
}

export const getAllMonthlyStars = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
	try {
		let date = new Date(String(req.query.date));
		const userId = parseInt(String(req.query.userId));
		date.setDate(1);
		let targetDate = new Date(JSON.parse(JSON.stringify(date)));

		targetDate.setMonth(targetDate.getMonth() + 1);

		const allMonthlyStars = await prisma.daily.findMany({
			where: {
				AND: [
					{
						date: {
							lt: targetDate,
							gte: date
						}
					},
					{
						userId
					}
				]
			},
			select: {
				obtainedStar: true,
				date: true
			}
		});

		console.log({ opcode: OPCODE.SUCCESS, allMonthlyStars });
		return res.json({ opcode: OPCODE.SUCCESS, allMonthlyStars });
	} catch(error) {
		console.log(error);
		next(error);
	}
}