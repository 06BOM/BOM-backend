import express from 'express';
import { route } from 'express/lib/application';
import { createPlan, handleStar } from "../controllers/planController";

const router = express.Router();

router.post("/plan",createPlan);
router.delete("/plan/:planId");
router.patch("/plan/:planId");
router.patch("/plan/check");
router.get("/plan/total?date=${date}&userId=${userId}");
router.get("/plan/week/average?date=${date}&userId=${userId}");
router.get("/plan/month/average?date=${date}&userId=${userId}");
router.post("/star", handleStar);
router.get("/statistic?date=${date}&userId=${userId}");
router.get("/week/total?date=${date}&userId=${userId}");
router.get("/plan/month/total?date=${date}&userId=${userId}")


export default router;