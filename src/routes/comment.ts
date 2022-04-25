import express from 'express';
import { createComment, getCommentWithoutReply, createReply } from "../controllers/commentController";

const router = express.Router();

router.post('', createComment);
router.get('', getCommentWithoutReply);
router.post('/reply', createReply);


export default router;