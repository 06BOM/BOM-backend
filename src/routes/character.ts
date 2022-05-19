import express from 'express';
import { getCharacterInfomation,
         getCharacterImageUrl,
        } from "../controllers/characterController";

const router = express.Router();

router.get('', getCharacterInfomation);
router.get('/imageurl', getCharacterImageUrl);


export default router;