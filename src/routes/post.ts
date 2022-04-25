import express from 'express';
import { deletePost, soltingPostByCategory, getPostbyPostId, updatePost, getPostByTitle } from "../controllers/postController";

const router = express.Router();

router.delete("/delete", deletePost);
router.get("/category", soltingPostByCategory);
router.get("/title", getPostByTitle);
router.get("/:postId", getPostbyPostId);
router.patch("/:postId", updatePost);

export default router;