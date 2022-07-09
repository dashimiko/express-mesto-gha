const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const {
  login,
  createUser,
} = require('./controllers/users');

const { userAuthorization } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', userAuthorization, usersRouter);
app.use('/cards', userAuthorization, cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Вы обратились к несуществующей странице' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
