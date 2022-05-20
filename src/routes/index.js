import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
	console.log("hello");
	res.send("Hello!! this is for ci/cd test!!!");
});

export default router;