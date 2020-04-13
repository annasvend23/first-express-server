const router = require('express').Router();
const path = require('path');
const readFile = require('./read-file');
const logger = require('../logger');

const usersFilePath = path.join(__dirname, '../data/users.json');

router.get('/', (req, res) => {
  readFile(usersFilePath)
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ messege: 'Что-то пошло не так' });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  readFile(usersFilePath)
    .then((users) => {
      // eslint-disable-next-line no-underscore-dangle
      const user = users.find((u) => u._id === id);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ messege: 'Что-то пошло не так' });
    });
});

module.exports = router; // экспортировали роутер
