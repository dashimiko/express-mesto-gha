const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({}).then((cards) => {
    res.status(200).send(cards);
  });
};

const createCard = (req, res) => {
  const userId = req.user._id;

  const { name, link } = req.body;
  Card.create({ name, link, owner: userId }).then((card) => {
    res.status(201).send({ card });
  });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId).then((card) => {
    res.send(card);
  });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
};
