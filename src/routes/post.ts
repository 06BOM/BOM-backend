import express from 'express';
import { deletePost, soltingPostByCategory } from "../controllers/postController";

const router = express.Router();

router.delete("/delete", deletePost);
router.get("/category", soltingPostByCategory);


export default router;