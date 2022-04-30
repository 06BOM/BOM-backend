import express from "express";
import { Request, Response } from 'express';
import { createRepiPlan } from "../tools";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.send("Hello!!");
	createRepiPlan(0, 0, 0, 1);
});

export default router;