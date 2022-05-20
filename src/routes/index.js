import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
	console.log("hello hihihi");
	res.send("Hello!! hihihi!!");
});

export default router;