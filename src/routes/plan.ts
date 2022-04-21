import express from 'express';
import { createPlan, 
         deletePlan, 
         updatePlan, 
         handleStar, 
         changeCheckToTrue,
         getPlanTime, 
         getDailyStudyTime, 
         getWeeklyAverageStudyTime, 
         getMonthlyAverageStudyTime, 
         getStatistic,
         getDailyStar, 
         getWeeklyStar, 
         getWeeklyTime, 
         getMonthlyStar, 
         getMonthlyTime,
         getAllPlans, 
         getCompletedPlans, 
         getIncompletePlans,
         getUserId 
    } from "../controllers/planController";

const router = express.Router();

router.post("", createPlan);
router.route("/:planId").delete(deletePlan).patch(updatePlan).get(getUserId);
router.patch("/:planId/check", changeCheckToTrue);
router.get("/:planId/time", getPlanTime);
router.get("/total", getDailyStudyTime);
router.get("/week/average", getWeeklyAverageStudyTime);
router.get("/month/average", getMonthlyAverageStudyTime);
router.get("/statistic", getStatistic);
router.get("/week/total",getWeeklyTime);
router.get("/month/total",getMonthlyTime)
router.route("/star").get(getDailyStar).post(handleStar);
router.get("/week/star", getWeeklyStar);
router.get("/month/star", getMonthlyStar);
router.get("/all", getAllPlans);
router.get("/completed", getCompletedPlans);
router.get("/incomplete", getIncompletePlans);

export default router;