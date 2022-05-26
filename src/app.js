import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import monitorRouter from './routes/monitor.route.js';
import config from './config/config.js';
import ApiError from './utils/ApiError.js';
import error from './middlewares/error.js';
import httpStatus from 'http-status';

// es6 __dirname not defined 
const __dirname = path.resolve();

// express
const app = express();

// morgan
if (config.env === 'production') app.use(morgan('combined'));
else app.use(morgan('dev'));

// other middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(config.cookie.secret));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// backend router
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', monitorRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

// error handler
app.use(error.errorConverter);
app.use(error.errorHandler);

export default app;