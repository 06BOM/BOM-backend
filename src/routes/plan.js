import express from 'express';
import { handleStar } from "../controllers/planController";

const router = express.Router();

router.post("/star", handleStar);
router.get("/statistic?date=${date}&userId=${userId}");
router.get("/week/total?date=${date}&userId=${userId}");
router.get("/plan/month/total?date=${date}&userId=${userId}")


export default router;