import express from 'express';
import { authMiddleware } from "../middleware";

import { deletePost,
         createPost,
         updatePost,
         sortingPostByCategory,
         getPostbyPostId,
         getPostByTitle,
         getMostLikePost,
         sortingByKind
} from "../controllers/postController";


const router = express.Router();

router.post("/", createPost);
router.patch("/", updatePost);
router.delete("/delete", deletePost);
router.get("/category", sortingPostByCategory);
router.get("/kind", sortingByKind);
router.get("/title", getPostByTitle);
router.get("/popular", getMostLikePost);
router.get("/:postId", getPostbyPostId);




export default router;