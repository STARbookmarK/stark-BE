import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import monitorRouter from './routes/monitor.route.js';

// .env
dotenv.config();

// es6 __dirname not defined 
const __dirname = path.resolve();

// express
const app = express();
app.set('port', '8081');

// morgan
if (process.env.NODE_ENV === 'production') app.use(morgan('combined'));
else app.use(morgan('dev'));

// other middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// backend router
app.use('/', authRouter);
app.use('/', monitorRouter);

// create server
app.listen(app.get('port'), () => {
  console.log(app.get('port') + ' 빈 포트에서 대기 중');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
});