
const http = require('http')
const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router();
const prisma = new PrismaClient();


router.get("/", (req, res, next) => {
	res.json({"hello": "hello"});
});

export default router;