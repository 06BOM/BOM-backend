import express from 'express';
import { createComment, 
         getCommentWithoutReply, 
         createReply, 
         getCommentWithReply,
         updateComment
        } from "../controllers/commentController";

const router = express.Router();

router.post('', createComment);
router.get('', getCommentWithoutReply);
router.post('/reply', createReply);
router.get('/reply', getCommentWithReply);
router.route('/:commentId').patch(updateComment)

export default router;