const router = require('express').Router();

const {
  getAllUser,
  getIdUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUser);

router.get('/:userId', getIdUser);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
