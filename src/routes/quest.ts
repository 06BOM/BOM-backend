import express from 'express';
import { 
	createQuestAttempt,
	getQuestAttempt,
	updateQuestAttempt,
	deleteQuestAttempt
        } from "../controllers/questController";

const router = express.Router();

router.post('/', createQuestAttempt);
router.get('/', getQuestAttempt);
router.patch('/', updateQuestAttempt);
router.delete('/', deleteQuestAttempt);

export default router;