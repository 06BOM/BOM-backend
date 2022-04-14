import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const insertPlan = async (plan) => {
    try {
        const result = await prisma.plan.create({
            data: plan
        });
    return result;

    } catch(error) {
        console.log(error);
	}
}


export const updatePlan = async (plan, planId) => {
    try {
        const result = await prisma.plan.update({
            where: {
                planId: planId
            },
            data: plan
        })
        return result;
        
    } catch(error) {
        console.log(error);
	}
}


export const updateCheck = async (planId) => {
    try {
        const result = await prisma.plan.update({
            where: {
                planId: planId
            },
            data: {
                check: true
            }
        })
        return result;
        
    } catch(error) {
        console.log(error);
	}
}

export const removePlanById = async (planId) => {
    try {
        const result = await prisma.plan.delete({
            where: {
                planId: planId,
            }
        });
        return result;

    } catch(error) {
        console.log(error);
	}
}
