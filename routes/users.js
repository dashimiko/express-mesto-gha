const router = require('express').Router();

const {
  getAllUser,
  getIdUser,
  createUser,
} = require('../controllers/users');

router.get('/', getAllUser);

router.get('/:userId', getIdUser);

router.post('/', createUser);

module.exports = router;
