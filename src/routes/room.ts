import express from 'express';

import { getRoomInformation,
         searchRoom,
    
} from "../controllers/roomController";


const router = express.Router();

router.get("/", getRoomInformation);
router.get("/search", searchRoom);

export default router;