const Channel = require('../models/Channel');

const createChannel = async (req, res) => {
  const { workspaceId, name, type } = req.body;
  try {
    const channel = await Channel.create({ workspaceId, name, type });
    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ message: 'Error creating channel' });
  }
};

const getChannels = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const channels = await Channel.find({ workspaceId });
    res.json(channels);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching channels' });
  }
};

module.exports = { createChannel, getChannels };
