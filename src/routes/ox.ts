import express from 'express';
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

router.post('', createOxQuestion);
router.get('', getOxQuestion);
router.patch('/:id', updateOxQuestion);
router.delete('/:id', deleteOxQuestion);
router.get('/statistics', getOxStats);
router.patch('/:id/total', increaseTotalNumSolved);
router.patch('/:id/correct', increaseCorrectNum);

export default router;