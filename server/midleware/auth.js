const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");


exports.isAuthenticated = async (req,res,next) =>
    {
try {
    
    const { token } = req.cookies;
     if (!token) {
     return res.status(404).send({message:"Please login."});
    }
  
    const decode = jwt.verify(token, "shhhhh");

    req.user = await userModel.findById(decode.id);
    next();
} catch (error) {
    console.error(error);
}
}