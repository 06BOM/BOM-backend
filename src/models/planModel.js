import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Plan {

    static async createPlan(plan){
        try {
            const plan = await prisma.plan.create({
                data: {
                    plan
                }
            });
        return plan;
    
        } catch(error) {
            console.log(error);
        }
    
    }
}
