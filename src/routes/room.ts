import express from 'express';

import { getRoomInformation,
         searchRoom,
         getAllRoom
} from "../controllers/roomController";

const router = express.Router();

router.get("/", getRoomInformation);
router.get("/search", searchRoom);
router.get("/all", getAllRoom);

export default router;