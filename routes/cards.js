const router = require('express').Router();
const path = require('path');
const readFile = require('./read-file');

const cardsFilePath = path.join(__dirname, '../data/cards.json');

router.get('/', (req, res) => {
  readFile(cardsFilePath)
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ messege: 'Что-то пошло не так' });
    });
});

module.exports = router; // экспортировали роутер
