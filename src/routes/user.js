//참고 https://codingcoding.tistory.com/1308

import express from 'express';
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post("/signin", userController.signin);
router.get("/:userId", userController.findUser);
router.delete("/:userId",userController.deleteUser);
router.patch("/:userId",userController.modifyUser);
export default router;