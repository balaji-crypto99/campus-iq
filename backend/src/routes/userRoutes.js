const express = require('express');
const { getUsers, getUserById, updateProfile } = require('../controllers/userController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateUser);

router.get('/', requireAdmin, getUsers);
router.get('/:id', requireAdmin, getUserById);
router.put('/profile', updateProfile);

module.exports = router;
