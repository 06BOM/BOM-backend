//참고 https://codingcoding.tistory.com/1308

import express from 'express';

import { signin,
         getUser, 
         deleteUser, 
         modifyUser 
    } from '../controllers/userControllers';
import { authMiddleware } from "../middleware";

const router = express.Router();

router.post("/signin", authMiddleware, signin);
router.route("/:userId").get(getUser).delete(authMiddleware, deleteUser).patch(authMiddleware, modifyUser);
export default router;