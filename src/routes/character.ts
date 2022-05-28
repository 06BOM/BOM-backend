import express from 'express';
import { authMiddleware } from '../middleware';

import { getCharacterInfomation,
         getCharacterImageUrl,
         getAllCharacters,
         createCollection,
         deleteCollection,
         searchCharacter,
         searchNotHavingCharacter
        } from "../controllers/characterController";

const router = express.Router();

router.get('', getCharacterInfomation);
router.get('/imageurl', getCharacterImageUrl);
router.get('/user/collection', getAllCharacters);
router.post('/user/collection', authMiddleware, createCollection);
router.delete('/user/collection', authMiddleware, deleteCollection);
router.get('/search', searchCharacter);
router.get('/user/want', searchNotHavingCharacter);

export default router;