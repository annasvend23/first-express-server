const User = require('../models/user');
const logger = require('../logger');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports = {
  createUser, getUsers, getUserById, updateProfile, updateAvatar,
};
