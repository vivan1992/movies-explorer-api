require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');

const corsOptions = {
  origin: ['https://movies.ivan.nomoreparties.sbs', 'http://movies.ivan.nomoreparties.sbs', 'http://localhost:3000'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Accept'],
  credentials: true,
};

const { PORT = 3000, MONGO_URL, NODE_ENV } = process.env;
const app = express();
app.use('*', cors(corsOptions));
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(limiter);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});
