const User = require('../models/user');

const getAllUser = (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  }).catch(() => res.status(500).send({ message: 'Что-то пошло не так' }));
};

const getIdUser = (req, res) => {
  User.findOne({ _id: req.params.userId }).then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      return;
    }
    res.status(200).send(user);
  }).catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((user) => {
    res.status(201).send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля. Заполните поля, в них должно быть от 2 до 30 символов' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      return;
    } res.status(200).send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля. Заполните поля, в них должно быть от 2 до 30 символов' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  ).then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      return;
    }
    res.status(200).send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара. Заполните поле' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  });
};

module.exports = {
  getAllUser,
  getIdUser,
  createUser,
  updateUser,
  updateAvatar,
};
