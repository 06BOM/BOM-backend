import express from 'express';
import { getCharacterInfomation,
         getCharacterImageUrl,
         getAllCharacters,
         createCollection,
         deleteCollection,
         searchCharacter
        } from "../controllers/characterController";

const router = express.Router();

router.get('', getCharacterInfomation);
router.get('/imageurl', getCharacterImageUrl);
router.get('/user/collection', getAllCharacters);
router.post('/user/collection', createCollection);
router.delete('/user/collection', deleteCollection);
router.get('/search', searchCharacter);

export default router;