import express from 'express';

import { getRoomInformation,
    
} from "../controllers/roomController";


const router = express.Router();

router.get("/", getRoomInformation);

export default router;