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
		 getAllMonthlyStars,
         getRepititionValidity 
    } from "../controllers/planController";
import { authMiddleware } from "../middleware";

const router = express.Router();

router.post("/", authMiddleware, createPlan);
router.get("/total", authMiddleware, getDailyStudyTime);
router.get("/week/average", authMiddleware, getWeeklyAverageStudyTime);
router.get("/month/average", authMiddleware, getMonthlyAverageStudyTime);
router.get("/statistic", authMiddleware, getStatistic);
router.get("/week/total", authMiddleware, getWeeklyTime);
router.get("/month/total", authMiddleware, getMonthlyTime)
router.route("/star").get(authMiddleware, getDailyStar).post(authMiddleware, handleStar);
router.get("/week/star", authMiddleware, getWeeklyStar);
router.get("/month/star", getMonthlyStar);
router.get("/all", authMiddleware, getAllPlans);
router.get("/completed", authMiddleware, getCompletedPlans);
router.get("/incomplete", authMiddleware, getIncompletePlans);
router.get("/month/all/star", authMiddleware, getAllMonthlyStars);
router.route("/:planId").delete(authMiddleware, deletePlan).patch(authMiddleware, updatePlan).get(getUserId);
router.get("/:planId/time", getPlanTime);
router.get("/:planId/data",getPlanData);
router.get("/:planId/validity", getRepititionValidity);

export default router;