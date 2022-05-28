import express from 'express';
import { authMiddleware } from "../middleware";
import { createCategory,
         deleteCategory,
		 getCategory 
        } from "../controllers/categoryController";

const router = express.Router();

router.post('', authMiddleware, createCategory);
router.delete('/:categoryId', authMiddleware, deleteCategory);
router.get('/user', getCategory);

export default router;