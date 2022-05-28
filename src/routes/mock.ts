import express from 'express';
import { 
    createQuestQuestion,
    getQuestQuestion,
    updateQuestQuestion,
    deleteQuestQuestion,
    provisionCheckToTrue,
    increaseTotalNumSolved,
    increaseCorrectNum,
    getQuestStats,
    getQuestQuestionsByUserId
        } from "../controllers/mockController";
import { authMiddleware } from "../middleware";

const router = express.Router();

router.post('', authMiddleware, createQuestQuestion);
router.get('', getQuestQuestion);
router.patch('/:id', authMiddleware, updateQuestQuestion);
router.delete('/:id', authMiddleware, deleteQuestQuestion);
router.patch('/:id/check', authMiddleware, provisionCheckToTrue);
router.patch('/:id/total', authMiddleware, increaseTotalNumSolved);
router.patch('/:id/correct', authMiddleware, increaseCorrectNum);
router.get('/statistics', getQuestStats);
router.get('/user/:userId', getQuestQuestionsByUserId);

export default router;