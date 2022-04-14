import express from 'express';
import { getDailyStar, handleStar, getWeeklyStar, getMonthlyStar, getAllPlans, getCompletedPlans, getIncompletePlans } from "../controllers/planController";

const router = express.Router();

router.route("/star").get(getDailyStar).post(handleStar);
router.get("/week/star", getWeeklyStar);
router.get("/month/star", getMonthlyStar);
router.get("/all", getAllPlans);
router.get("/completed", getCompletedPlans);
router.get("/incomplete", getIncompletePlans);

export default router;