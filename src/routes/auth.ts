import express from 'express';
import { logIn 
        } from "../controllers/authController";

const router = express.Router();

router.post('/login', logIn);


export default router;