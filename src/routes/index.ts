import express from "express";
import { Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.send("Hello!!");
});

router.get('/test', (req: Request, res: Response) => {
	return res.render("home");
});

export default router;