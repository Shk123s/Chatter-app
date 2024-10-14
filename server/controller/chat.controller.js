const { default: axios } = require("axios");

exports.addChat = async (req, res) => {
  try {
    const { name, groupChat, creator, members } = req.body;

    const addmessage = await chatModel.create({ ...req.body });

    if (!addmessage)
      return res
        .status(400)
        .send({ message: "Error occured while adding message " });

    res.status(200).send({ message: "Chat added. " });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, creator, members } = req.body;

    req.body.groupChat = true;

    if (members.length <= 2) {
      res.send({ message: "please add more member." });
    }

    const createGroup = await chatModel.create({ ...req.body });

    if (!createGroup)
      return res
        .status(400)
        .send({ message: "Error occured while adding message " });

    res.status(200).send({ message: "Group created. " });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { name, creator, members } = req.body;

    req.body.groupChat = false;

    if (members.length > 1) {
      res.send({ message: "chat requires only one member ." });
    }

    const createChat = await chatModel.create({ ...req.body });

    if (!createChat)
      return res
        .status(400)
        .send({ message: "Error occured while adding message " });

    res.status(200).send({ message: "chat created. " });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

