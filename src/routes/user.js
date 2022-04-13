//참고 https://codingcoding.tistory.com/1308

import express from 'express';
const router = express.Router();
const userController = require('../controllers/userControllers');

router.delete("/user/:userId", userController.deleteUser);
router.patch("/user/:userId", userController.handleUser);
router.get("/user/:userId", userController.getUser);
router.post("/user", userController.signin);


export default router;