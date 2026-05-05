const Workspace = require('../models/Workspace');
const User = require('../models/User');

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
  const { name } = req.body;

  try {
    const workspace = await Workspace.create({
      name,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ message: 'Invalid workspace data' });
  }
};

// @desc    Get user's workspaces
// @route   GET /api/workspaces
// @access  Private
const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id
    }).populate('members.user', 'name email avatar');
    
    res.json(workspaces);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching workspaces' });
  }
};

// @desc    Get workspace by ID
// @route   GET /api/workspaces/:id
// @access  Private
const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is a member
    const isMember = workspace.members.find(m => m.user._id.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to access this workspace' });
    }

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching workspace' });
  }
};

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private (Admin only)
const addMember = async (req, res) => {
  const { email } = req.body;
  
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    // Verify requesting user is admin
    const isRequestingUserAdmin = workspace.members.find(
      m => m.user.toString() === req.user._id.toString() && m.role === 'admin'
    );
    if (!isRequestingUserAdmin) {
      return res.status(403).json({ message: 'Only admins can add members' });
    }

    // Find user to add
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    // Check if already a member
    const isAlreadyMember = workspace.members.find(m => m.user.toString() === userToAdd._id.toString());
    if (isAlreadyMember) return res.status(400).json({ message: 'User is already a member' });

    workspace.members.push({ user: userToAdd._id, role: 'member' });
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: 'Error adding member' });
  }
};

module.exports = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  addMember
};
