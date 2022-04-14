//참고 https://codingcoding.tistory.com/1308

import express from 'express';
const router = express.Router();

import { signin,
         getUser, 
         deleteUser, 
         modifyUser 
    } from '../controllers/userControllers';



router.post("/signin", signin);
router.get("/:userId", getUser);
router.delete("/:userId",deleteUser);
router.patch("/:userId",modifyUser);
export default router;