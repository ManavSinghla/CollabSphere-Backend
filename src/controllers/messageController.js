const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { channelId } = req.params;
  try {
    const messages = await Message.find({ channelId }).populate('senderId', 'name avatar');
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching messages' });
  }
};

module.exports = { getMessages };
