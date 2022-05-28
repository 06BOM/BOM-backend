import express from 'express';
import { 
	createQuestAttempt,
	getQuestAttempt,
	updateQuestAttempt,
	deleteQuestAttempt
        } from "../controllers/questController";
import { authMiddleware } from "../middleware";

const router = express.Router();

router.post('/', authMiddleware, createQuestAttempt);
router.get('/', getQuestAttempt);
router.patch('/', authMiddleware, updateQuestAttempt);
router.delete('/', authMiddleware, deleteQuestAttempt);

export default router;