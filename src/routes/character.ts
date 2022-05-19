import express from 'express';
import { getCharacterInfomation,
         getCharacterImageUrl,
         getAllCharacters
        } from "../controllers/characterController";

const router = express.Router();

router.get('', getCharacterInfomation);
router.get('/imageurl', getCharacterImageUrl);
router.get('/user/collection', getAllCharacters);


export default router;