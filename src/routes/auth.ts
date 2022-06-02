import express from 'express';
import { authMiddleware } from "../middleware";

import { logIn,
	 logOut,
         signIn,
         snsCallback,
	 newToken 
        } from "../controllers/authController";


const router = express.Router();

router.post('/login', logIn);
router.get('/callback', snsCallback);
router.delete('/logout', authMiddleware, logOut);
router.post('/signin', signIn);
router.post('/new', newToken);

export default router;