const express = require('express');
const { reanalyzeGrievance, generateDailyReport, getRelated } = require('../controllers/aiController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateUser);

router.post('/analyze/:grievanceId', requireAdmin, reanalyzeGrievance);
router.post('/daily-report', requireAdmin, generateDailyReport);
router.post('/related/:grievanceId', getRelated);

module.exports = router;
