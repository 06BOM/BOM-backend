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
