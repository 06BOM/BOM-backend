import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
	res.send("Hello!! ci/cd test!!");
});

export default router;