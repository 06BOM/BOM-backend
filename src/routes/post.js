import express from 'express';
import { deletePost } from "../controllers/postController";

const router = express.Router();

router.delete("/delete", deletePost);


export default router;