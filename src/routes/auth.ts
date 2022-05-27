import express from 'express';
import passport from 'passport';
import { logIn,
        signIn 
        } from "../controllers/authController";

const router = express.Router();

router.post('/login', logIn);
router.post('/signin', signIn);

export default router;