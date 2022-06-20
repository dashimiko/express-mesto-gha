const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62ae4768510cc89af20a96d7',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Вы обратились к несуществующей странице' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
