import express from 'express';
import { deleteUser, handleUser, getUser, signin } from "../controllers/userController";

const router = express.Router();

router.delete("/user/:userId", deleteUser);
router.patch("/user/:userId", handleUser);
router.get("/user/:userId",getUser);
router.post("/user",signin);

export default router;