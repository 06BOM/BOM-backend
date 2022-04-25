import express from 'express';
import { deletePost, updatePost } from "../controllers/postController";

const router = express.Router();

router.delete("/delete", deletePost);
router.patch("/", updatePost);


export default router;