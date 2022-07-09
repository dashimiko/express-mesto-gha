const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const MONGO_DUPLICATE_ERROR_CODE = 11000;

const getAllUser = (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  }).catch(() => res.status(500).send({ message: 'Что-то пошло не так' }));
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ user }))
    .catch(next);
};

const getIdUser = (req, res) => {
  User.findOne({ _id: req.params.userId }).then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
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
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Не передан email или пароль.' });
    return;
  }
  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })).then((user) => res.status(201).send({
    data: {
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    },
  })).catch((err) => {
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      res.status(409).send({ message: 'email занят' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  });
};// неинформативные ошибки с некеорректным имейлом и паролем

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

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'very secret', { expiresIn: '7d' });
      res.send({ token });
    }).catch(next);
};

module.exports = {
  getAllUser,
  getIdUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
