import express from 'express';
import { getCharacterInfomation,
         getCharacterImageUrl,
         getAllCharacters,
         createCollection
        } from "../controllers/characterController";

const router = express.Router();

router.get('', getCharacterInfomation);
router.get('/imageurl', getCharacterImageUrl);
router.get('/user/collection', getAllCharacters);
router.post('/user/collection', createCollection);

export default router;