const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).send({ message: 'Минимальная длина пароля 8 символов' });
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        _id: user._id, name, about, avatar, email,
      },
    }))
    .catch((err) => {
      console.error(err);
      res.status(400).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports = {
  login, createUser, getUsers, getUserById, updateProfile, updateAvatar,
};
