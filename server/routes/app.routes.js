const {addMessage} = require("../controller/message.controller");
const {addUser, getUser, getUserById} = require("../controller/user.controller");
const {addChat, createGroup, createChat, getSingleChat, getAllChats} = require("../controller/chat.controller");
const {login,logOut} = require("../controller/user.controller");
const { isAuthenticated } = require("../midleware/auth");
const router = require("express").Router();
//message 
router.post("/addMessage",addMessage);
//chat 
router.post("/addchat",addChat);
router.post("/createGroup",createGroup);
router.post("/createChat",createChat);
router.get("/getChat/:id",isAuthenticated,getSingleChat);
router.get("/getAllChat",isAuthenticated,getAllChats);

//user 
router.get("/getUser",getUser);
router.get("/getUser/:id",getUserById);
router.post("/login",login);
router.post("/adduser",addUser);
router.post("/logout",isAuthenticated,logOut);

module.exports = router;