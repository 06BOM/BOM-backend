import express from 'express';
import { route } from 'express/lib/application';
import { createPlan, deletePlan, updatePlan, handleStar, changeCheckToTrue, getDailyStudyTime, getWeeklyAverageStudyTime, getDailyStar, getWeeklyStar, getMonthlyStar, getAllPlans, getCompletedPlans, getIncompletePlans } from "../controllers/planController";

const router = express.Router();

router.post("", createPlan);
router.delete("/:planId", deletePlan);
router.patch("/:planId", updatePlan);
router.patch("/:planId/check", changeCheckToTrue);
router.get("/total", getDailyStudyTime);
router.get("/week/average", getWeeklyAverageStudyTime);
router.get("/month/average");
router.get("/plan/statistic?date=${date}&userId=${userId}");
router.get("/plan/week/total?date=${date}&userId=${userId}");
router.get("/plan/month/total?date=${date}&userId=${userId}")
router.route("/star").get(getDailyStar).post(handleStar);
router.get("/week/star", getWeeklyStar);
router.get("/month/star", getMonthlyStar);
router.get("/all", getAllPlans);
router.get("/completed", getCompletedPlans);
router.get("/incomplete", getIncompletePlans);

export default router;