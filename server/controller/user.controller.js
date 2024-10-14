const UserModel = require("../model/user.model");
const  jwt = require('jsonwebtoken')

exports.addUser = async (req, res) => {
  try {
    const { username, bio, password, avatar } = req.body;
    console.log(username, bio, password, avatar, req.body, "dddddddddddd");
    const addmessage = await UserModel.create({
      username,
      bio,
      password,
      avatar,
    });

    if (!addmessage)
      return res
        .status(400)
        .send({ message: "Error occured while adding message " });

    res.status(200).send({ message: "Message added. " });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
exports.getUser = async (req, res) => {
  try {
    const fetchAll = await UserModel.find({});

    if (!fetchAll)
      return res
        .status(400)
        .send({ message: "Error occured while fetching user " });

    res.status(200).send({ message: fetchAll });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const Id = req.params.id;
    const fetchOne = await UserModel.findOne({ _id: Id });

    if (!fetchOne) return res.status(400).send({ message: "No found." });

    res.status(200).send({ user: fetchOne });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const findOne = await UserModel.findOne({ username: username });

    if (!findOne)
      return res.status(200).send({ message: "user does not exist" });
   
      if (findOne.password === password) {

        const token = jwt.sign({ user_id: findOne._id }, "shhhhh");
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
        });
      
      return res.status(200).send({ message: "Login successfull", token, userDetails:findOne});
    }
    else {
      return res.status(404).send({message:"Invalid cremdentails"})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: "Internal server Error in login" });
  }
};

exports.logOut = (req, res, next) => {
  try {
    // res.clearCookie("token");
    res.cookie('token', '', { 
      maxAge: 0,
      httpOnly: true, 
  });
  return res.status(200).send({ message: 'Logged out successfully.' });
  } catch (ex) {
    next(ex);
  }
};
    