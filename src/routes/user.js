//참고 https://codingcoding.tistory.com/1308

import express from 'express';

import { signin,
         getUser, 
         deleteUser, 
         modifyUser 
    } from '../controllers/userControllers';

const router = express.Router();


router.post("/signin", signin);
router.route("/:userId").get(getUser).delete(deleteUser).patch(modifyUser);
export default router;