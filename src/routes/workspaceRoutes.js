const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  addMember
} = require('../controllers/workspaceController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createWorkspace)
  .get(protect, getUserWorkspaces);

router.route('/:id')
  .get(protect, getWorkspaceById);

router.route('/:id/members')
  .post(protect, addMember);

module.exports = router;
