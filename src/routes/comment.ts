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

router.post('', createComment);
router.get('', getCommentWithoutReply);
router.post('/reply', createReply);
router.get('/reply', getCommentWithReply);
router.route('/:commentId').patch(updateComment).delete(deleteComment)

export default router;