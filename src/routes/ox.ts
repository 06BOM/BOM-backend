import express from 'express';
import { authMiddleware } from "../middleware";

import { 
    createOxQuestion,
    getOxQuestion,
    updateOxQuestion,
    deleteOxQuestion,
    getOxStats,
    increaseTotalNumSolved,
    increaseCorrectNum
        } from "../controllers/oxController";

		
const router = express.Router();

router.post('', authMiddleware, createOxQuestion);
router.get('', getOxQuestion);
router.patch('/:id', authMiddleware, updateOxQuestion);
router.delete('/:id', authMiddleware, deleteOxQuestion);
router.get('/statistics', getOxStats);
router.patch('/:id/total', authMiddleware, increaseTotalNumSolved);
router.patch('/:id/correct', authMiddleware, increaseCorrectNum);

export default router;