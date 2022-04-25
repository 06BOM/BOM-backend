import express from 'express';
import { deletePost, soltingPostByCategory, getPostbyPostId, updatePost } from "../controllers/postController";

const router = express.Router();

router.delete("/delete", deletePost);
router.get("/category", soltingPostByCategory);
router.get("/:postId", getPostbyPostId);
router.patch("/", updatePost);


export default router;