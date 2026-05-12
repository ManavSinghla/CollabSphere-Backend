const Document = require('../models/Document');

const createDocument = async (req, res) => {
  const { workspaceId, title } = req.body;
  try {
    const document = await Document.create({ workspaceId, title, lastEditedBy: req.user._id });
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error creating document' });
  }
};

const getDocuments = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const documents = await Document.find({ workspaceId }).sort({ updatedAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching documents' });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching document' });
  }
};

const updateDocument = async (req, res) => {
  const { content, title } = req.body;
  const updates = { lastEditedBy: req.user._id };
  if (content !== undefined) updates.content = content;
  if (title !== undefined) updates.title = title;

  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id, 
      updates,
      { new: true }
    );
    res.json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error updating document' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting document' });
  }
};

module.exports = { createDocument, getDocuments, getDocumentById, updateDocument, deleteDocument };
