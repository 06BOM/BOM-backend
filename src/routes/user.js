import express from 'express';

const router = express.Router();

router.get("/", (req, res, next) => {
	res.json({"hello": "hello"});
});

export default router;