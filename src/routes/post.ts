import express from 'express';
import { deletePost, sortingPostByCategory, getPostbyPostId, updatePost, getPostByTitle } from "../controllers/postController";

const router = express.Router();

router.delete("/delete", deletePost);
router.get("/category", sortingPostByCategory);
router.get("/title", getPostByTitle);
router.get("/:postId", getPostbyPostId);
router.patch("/", updatePost);

export default router;