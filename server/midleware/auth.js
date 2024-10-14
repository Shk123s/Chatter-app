const userModel = require("../model/user.model");


exports.isAuthenticated = async (req,res,next) =>
    {
try {
    
    const { token}  = req.cookie ; 

     if (!token) {
     res.status(404).send({message:"Not authorized"});
    }
  
    const decode = jwt.verify(token, "shhhhh");
    console.log(decode)
    req.user = await userModel.findById(decode.id);
    next();
} catch (error) {
    console.error(error);
}
}