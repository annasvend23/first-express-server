const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const { NODE_ENV, JWT_SECRET } = process.env;
const MIN_PASSWORD_LENGTH = 8;

const login = (req, res, next) => {
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
          domain: 'project-mesto.host',
        })
        .cookie('isAuthorized', true, {
          maxAge: 3600000 * 24 * 7,
          sameSite: true,
          domain: 'project-mesto.host',
        })
        .send({});
    })
    .catch(next);
};

const logout = (req, res) => res
  .cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: true,
    domain: 'project-mesto.host',
  })
  .cookie('isAuthorized', false, {
    maxAge: 0,
    sameSite: true,
    domain: 'project-mesto.host',
  })
  .send({});

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw BadRequestError(`Минимальная длина пароля ${MIN_PASSWORD_LENGTH} символов`);
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
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
          domain: 'project-mesto.host',
        })
        .cookie('isAuthorized', true, {
          maxAge: 3600000 * 24 * 7,
          sameSite: true,
          domain: 'project-mesto.host',
        })
        .send({
          data: {
            _id: user._id, name, about, avatar, email,
          },
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new BadRequestError('Пользователь с такой почтой уже есть в базе'));
      }
      return next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const userId = req.params.userId || req.user._id;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Нет пользователя с таким id');
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports = {
  login, logout, createUser, getUsers, getUserById, updateProfile, updateAvatar,
};
