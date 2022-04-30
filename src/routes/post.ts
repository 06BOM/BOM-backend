import express from 'express';

import { deletePost,
         createPost,
         updatePost,
         sortingPostByCategory,
         getPostbyPostId,
         getPostByTitle,
         getMostLikePost
} from "../controllers/postController";


const router = express.Router();

router.post("/",createPost);
router.delete("/delete", deletePost);
router.get("/category", sortingPostByCategory);
router.get("/title", getPostByTitle);
router.get("/popular", getMostLikePost);
router.get("/:postId", getPostbyPostId);
router.patch("/", updatePost);



export default router;