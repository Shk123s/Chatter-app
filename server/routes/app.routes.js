const {addMessage} = require("../controller/message.controller");
const {addUser, getUser, getUserById} = require("../controller/user.controller");
const {addChat, createGroup, createChat, getFunction} = require("../controller/chat.controller");
const {login,logOut} = require("../controller/user.controller");
const { isAuthenticated } = require("../midleware/auth");
const router = require("express").Router();

router.post("/addMessage",addMessage);
router.post("/adduser",addUser);
router.post("/addchat",addChat);
router.post("/createGroup",createGroup);
router.post("/createChat",createChat);
router.get("/getUser",getUser);
router.get("/getUser/:id",getUserById);
router.post("/login",isAuthenticated,login);
router.post("/logout",logOut);

module.exports = router;