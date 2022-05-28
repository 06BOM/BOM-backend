import express from 'express';
import { authMiddleware } from "../middleware";

import { createComment, 
         getCommentWithoutReply, 
         createReply, 
         getCommentWithReply,
         updateComment,
         deleteComment
        } from "../controllers/commentController";

const router = express.Router();

router.post('', authMiddleware, createComment);
router.get('', getCommentWithoutReply);
router.post('/reply', authMiddleware, createReply);
router.get('/reply', getCommentWithReply);
router.route('/:commentId').patch(authMiddleware, updateComment).delete(authMiddleware, deleteComment)

export default router;