import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import indexRouter from "./routes";
import userRouter from "./routes/user";
import planRouter from "./routes/plan";
import { OPCODE, DamoyeoError } from './tools';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/plan', planRouter);

app.use((req, _, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

app.use((err, _, res, next) => {
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