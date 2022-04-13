//참고 https://codingcoding.tistory.com/1308

import express from 'express';
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post("/signin", userController.signin);
router.get("/:userId", userController.findUser);

export default router;