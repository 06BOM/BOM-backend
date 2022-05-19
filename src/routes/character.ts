import express from 'express';
import { getCharacterInfomation,
        } from "../controllers/characterController";

const router = express.Router();

router.get('', getCharacterInfomation);


export default router;