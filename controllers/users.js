const User = require('../models/user');

const getAllUser = (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  });
};

const getIdUser = (req, res) => {
  User.findOne({ _id: req.params.userId }).then((user) => {
    res.status(200).send(user);
  });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((user) => {
    res.status(201).send(user);
  });
};

module.exports = {
  getAllUser,
  getIdUser,
  createUser,
};
