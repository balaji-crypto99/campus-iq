const express = require('express');
const {
  getOverview,
  getCategories,
  getDepartments,
  getLocations,
  getTrends,
} = require('../controllers/analyticsController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateUser);

router.get('/overview', requireAdmin, getOverview);
router.get('/categories', requireAdmin, getCategories);
router.get('/departments', requireAdmin, getDepartments);
router.get('/locations', requireAdmin, getLocations);
router.get('/trends', requireAdmin, getTrends);

module.exports = router;
