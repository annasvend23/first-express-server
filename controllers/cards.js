const Card = require('../models/card');
const logger = require('../logger');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, removeLikeCard,
};
