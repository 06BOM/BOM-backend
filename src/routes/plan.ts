import express from 'express';
import { createPlan, 
         deletePlan, 
         updatePlan, 
         handleStar, 
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
         getUserId,
         getPlanData,
		 getAllMonthlyStars 
    } from "../controllers/planController";

const router = express.Router();

router.post("/", createPlan);
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
router.get("/month/all/star", getAllMonthlyStars);
router.route("/:planId").delete(deletePlan).patch(updatePlan).get(getUserId);
router.get("/:planId/time", getPlanTime);
router.get("/:planId/data",getPlanData);

export default router;