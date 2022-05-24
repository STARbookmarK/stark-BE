import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import monitorRouter from './routes/monitor.route.js';
import config from './config/config.js';

// es6 __dirname not defined 
const __dirname = path.resolve();

// express
const app = express();
app.set('port', '8081');

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
app.use('/', monitorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
});

export default app;