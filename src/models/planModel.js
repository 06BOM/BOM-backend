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
