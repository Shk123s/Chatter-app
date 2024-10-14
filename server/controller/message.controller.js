const messageModel = require("../model/message.model");

exports.addMessage = async (req, res) => {
  try {
    const { senderId, message, messageType, chatId } = req.body;

    const addmessage = await messageModel.create({ ...req.body });

    if (!addmessage)
      return res
        .status(400)
        .send({ message: "Error occured while adding message " });

    res.status(200).send({ message: "Message added. " });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "IzzzZnternal server error" });
  }
};
