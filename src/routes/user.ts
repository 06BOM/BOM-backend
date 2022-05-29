import express from 'express';
import { authMiddleware } from "../middleware";


import { getUser, 
         deleteUser, 
         modifyUser,
         changeCharacter 
    } from '../controllers/userControllers';

const router = express.Router();

router.patch("/character", changeCharacter);
router.route("/:userId").get(getUser).delete(authMiddleware, deleteUser).patch(authMiddleware, modifyUser);
export default router;