import express from 'express';
import { createComment, getCommentWithoutReply, createReply, getCommentWithReply } from "../controllers/commentController";

const router = express.Router();

router.post('', createComment);
router.get('', getCommentWithoutReply);
router.post('/reply', createReply);
router.get('/reply', getCommentWithReply);

export default router;