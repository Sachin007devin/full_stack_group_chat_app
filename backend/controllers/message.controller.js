const { Op } = require('sequelize');
const { Message } = require('../models');
const { sendResponse, errorResponse } = require('../utils/responseHandlers');

// 1. Store / Send a New Message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id; // Auth middleware se aayega
    const {receiverId} = req.params
    const { content, messageType = 'text', mediaUrl } = req.body;

    if (!receiverId || (!content && !mediaUrl)) {
      return res.status(400).json({ message: 'Receiver and message content/media are required.' });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      content,
      messageType,
      mediaUrl
    });

    return sendResponse(res,{
        statusCode: 201,
            message: 'message stored successfully',
            data:newMessage
    })
  } catch (error) {
    return errorResponse(res,{
        status:500,
        message:'some internal error occurred',
        error:error.message
    })
  }
};

// 2. Fetch Chat History (Latest 10 + Scroll Up Pagination)
const getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const { receiverId } = req.params;
    const { beforeId, limit = 10 } = req.query; // beforeId = sabse upar wale message ki ID

    // Core condition: (Sender=Me & Receiver=Robin) OR (Sender=Robin & Receiver=Me)
    const whereClause = {
      [Op.or]: [
        { senderId: loggedInUserId, receiverId: receiverId },
        { senderId: receiverId, receiverId: loggedInUserId }
      ]
    };

    // Agar user upar scroll kar raha hai, toh beforeId se purane messages lao
    if (beforeId) {
      whereClause.id = { [Op.lt]: parseInt(beforeId, 10) };
    }

    // Latest 10 fetch karo (DESC order mein)
    const messages = await Message.findAll({
      where: whereClause,
      order: [['id', 'DESC']],
      limit: parseInt(limit, 10)
    });

    // Frontend mein chronological (purana upar, naya niche) dikhane ke liye reverse karo
    const chronologicalMessages = messages.reverse();

    return sendResponse(res,{
        statusCode: 200,
            message: 'message fetched successfully',
            data:{chronologicalMessages ,hasMore: messages.length === parseInt(limit, 10)}
    })
  } catch (error) {
     return errorResponse(res,{
        status:500,
        message:'some internal error occurred',
        error:error.message
    })
  }
};

module.exports={
sendMessage,
getMessages
}