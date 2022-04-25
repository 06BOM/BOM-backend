import express from 'express';
import { createComment, getCommentWithoutReply } from "../controllers/commentController";

const router = express.Router();

router.post('', createComment);
router.get('', getCommentWithoutReply);


export default router;