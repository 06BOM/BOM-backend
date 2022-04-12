import express from 'express';
import { handleStar } from "../controllers/planController";

const router = express.Router();

router.get("/", (req, res, next) => {
	res.json({"hello": "hello"});
});

router.post("/star", handleStar);

export default router;