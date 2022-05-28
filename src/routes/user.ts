import express from 'express';
import { authMiddleware } from "../middleware";


import { getUser, 
         deleteUser, 
         modifyUser 
    } from '../controllers/userControllers';

const router = express.Router();


router.route("/:userId").get(getUser).delete(authMiddleware, deleteUser).patch(authMiddleware, modifyUser);
export default router;