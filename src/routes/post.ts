import express from 'express';

import { deletePost,
         createPost,
         updatePost,
         sortingPostByCategory,
         getPostbyPostId,
         getPostByTitle,
         getMostLikePost,
         sortingByKind
} from "../controllers/postController";
import { authMiddleware } from "../middleware";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.patch("/", authMiddleware, updatePost);
router.delete("/delete", authMiddleware, deletePost);
router.get("/category", sortingPostByCategory);
router.get("/kind", sortingByKind);
router.get("/title", getPostByTitle);
router.get("/popular", getMostLikePost);
router.get("/:postId", getPostbyPostId);




export default router;