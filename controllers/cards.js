const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({}).then((cards) => {
    res.status(200).send(cards);
  }).catch(() => res.status(500).send({ message: 'Что-то пошло не так' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((card) => {
    res.status(201).send({ card });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки. Заполните поля' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  });
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error('Вы можете удалять только созданные вами карточки');
      } else if (!card.owner.equals(owner)) {
        next(new Error('Вы можете удалять только созданные вами карточки'));
      } else {
        card.remove().then(() => res.send(card));
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send(card);
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.send(card);
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
