const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const deleteCard = (req, res) => {
  const user = req.user._id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      if (!card.owner.equals(user)) {
        return res.status(403).send({ message: 'Вы не можете удалить эту карточку' });
      }
      return Card.deleteOne({ _id: req.params.cardId })
        .then(() => {
          res.send({ data: card });
        });
    })
    .catch((err) => {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, removeLikeCard,
};
