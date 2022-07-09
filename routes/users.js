const router = require('express').Router();

const {
  getAllUser,
  getIdUser,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

router.get('/', getAllUser);

router.get('/me', getUser);

router.get('/:userId', getIdUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
