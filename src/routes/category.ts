import express from 'express';
import { createCategory,
         deleteCategory 
        } from "../controllers/categoryController";

const router = express.Router();

router.post('', createCategory);
router.delete('/:categoryId', deleteCategory);



export default router;