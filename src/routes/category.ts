import express from 'express';
import { authMiddleware } from "../middleware";

import { createCategory,
         deleteCategory,
	 getCategory 
        } from "../controllers/categoryController";

const router = express.Router();

router.post('', createCategory);
router.delete('/:categoryId', deleteCategory);
router.get('/user', getCategory);

export default router;