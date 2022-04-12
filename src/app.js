import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import indexRouter from "./routes";
import userRouter from "./routes/user";
import planRouter from "./routes/plan";
//푸

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));

app.use('/', indexRouter);
<<<<<<< HEAD
app.use('/user', userRouter);
=======
app.use('/plan', planRouter);
>>>>>>> 401d1c22da8bf630adc6db27b4801ea2dcc41bbd

export default app;