const express = require('express');
const { getNotifications, markRead } = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateUser);

router.get('/', getNotifications);
router.put('/:id/read', markRead);

module.exports = router;
