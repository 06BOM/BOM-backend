import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';

import indexRouter from "./routes";
import userRouter from "./routes/user";
import planRouter from "./routes/plan";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";
import categoryRouter from "./routes/category";
import { OPCODE, DamoyeoError } from './tools';
import { NextFunction, Request, Response } from 'express';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(path.join(process.cwd(), 'src', '/public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/plan', planRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/category', categoryRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
	const error = new DamoyeoError(`${req.method} ${req.url} 라우터가 없습니다.`, 404);
	next(error);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	let status = 500;
	let message = '알 수 없는 오류가 발생했습니다.';

	if (err instanceof DamoyeoError) {
		status = err.status;
		message = err.message;
	} else {
		message = err.message;
		if (err.status) {
			status = err.status;
		}
	}

	res.status(status).json({
		opcode: OPCODE.ERROR,
		message
	});
});

export default app;