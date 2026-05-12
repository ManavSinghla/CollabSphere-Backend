const express = require('express');
const router = express.Router();
const { createDocument, getDocuments, getDocumentById, updateDocument, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createDocument);

router.route('/workspace/:workspaceId')
  .get(protect, getDocuments);

router.route('/:id')
  .get(protect, getDocumentById)
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

module.exports = router;
