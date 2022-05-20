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

const router = express.Router();

router.post('', createQuestQuestion);
router.get('', getQuestQuestion);
router.patch('/:id', updateQuestQuestion);
router.delete('/:id', deleteQuestQuestion);
router.patch('/:id/check', provisionCheckToTrue);
router.patch('/:id/total', increaseTotalNumSolved);
router.patch('/:id/correct', increaseCorrectNum);
router.get('/statistics', getQuestStats);
router.get('/user/:userId', getQuestQuestionsByUserId);

export default router;