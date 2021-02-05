import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import session from 'express-session';
import MemoryStore from 'memorystore';
import cors from 'cors';

import indexRouter from './staticrouter/index';
import userRouter from './user/user.router';
import reimbRouter from './reimb/reimb.router';

import dotenv from 'dotenv';

dotenv.config();

var app = express();

app.use(cors({origin: 'http://localhost:3001', credentials: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'whatever',
  store: new (MemoryStore(session))({checkPeriod: 86400000}),
  cookie: {}}));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/reimbs', reimbRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;