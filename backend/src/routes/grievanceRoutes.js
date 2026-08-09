const express = require('express');
const { check } = require('express-validator');
const {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
} = require('../controllers/grievanceController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(authenticateUser);

router.post(
  '/',
  [
    check('title', 'Title is required').notEmpty().trim(),
    check('description', 'Description is required').notEmpty(),
    check('location', 'Location is required').notEmpty().trim(),
    validate,
  ],
  createGrievance
);

router.get('/', getGrievances);
router.get('/:id', getGrievanceById);
router.put('/:id', requireAdmin, updateGrievance);
router.delete('/:id', requireAdmin, deleteGrievance);

module.exports = router;
