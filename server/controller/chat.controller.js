
const chatModel = require("../model/chat.model");
const ObjectId = require("mongoose").Types.ObjectId;
exports.accessChat = async (req, res) => {
  try {
    const { name, groupChat, creator, members,userId } = req.body;
   
    var chatData = { name : "sender",
      creator :req.user._id,
      members : [userId] } 

      var  findPipeline = [
        {
          $addFields: {
            member: { $arrayElemAt: ["$members", 0] }
          }
        },
        {
          $addFields: {
            member: { $toObjectId: "$member" }
          }
        },
        {
          $match: {
            groupChat: false,
            creator: req.user._id,
            member: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "result"
          }
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$result", 0] }
          }
        },
          {
          $lookup: {
            from: "users",
            localField: "member",
            foreignField: "_id",
            as: "oppUser"
          }
        },
        {
          $addFields: {
            oppUser: { $arrayElemAt: ["$oppUser", 0] }
          }
        },
        {
          $addFields: {
           _id:"$_id",
            name:"$name",
            groupChat:"$groupChat",
            user:"$user",
            member:"$oppUser"
          }
        },
        {
          $project: {
            _id:1,
            name:1,
            groupChat:1,
            creator:"$user",
            member:1
          }
        }
      ];

      const fetchChat = await chatModel.aggregate(findPipeline); 

     if(fetchChat.length > 0){
      return res.status(200).send({message:"Chat already exists",data:fetchChat});
    } 
    else {
      const createChat = await chatModel.create({
        ...chatData
      });
      const findCreatedChat = await chatModel.aggregate(findPipeline);
      return res.status(200).send({message:"Chat added.",data:findCreatedChat});
    
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (members.length < 2) {
      res.send({ message: "please add more member." });
    }
    
    const createGroup = await chatModel.create({ 
      name:name,
      groupChat:true,
      creator:req.user._id,
      members:members
     });

     const groupPipeline = [
      {
        $match: {
          _id: createGroup._id
        }
      },
      {
        $addFields: {
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: { $toObjectId: "$$member" }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creatorDetails"
        }
      },
      {
        $addFields: {
          creator: {
            $arrayElemAt: ["$creatorDetails", 0]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "membersDetails"
        }
      },
      
      {
        $project: {
         
          _id: 1,
          name: 1,
          groupChat: 1,
          creator: 1,
          members: "$membersDetails",
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]
   
    const createGroupDetails = await chatModel.aggregate(groupPipeline);

    if (!createGroupDetails)
      return res
        .status(400)
        .send({ message: "Error occured while adding group " });

    res.status(200).send({ message: "Group created. ",data:createGroupDetails });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// exports.createChat = async (req, res) => {
//   try {
//     const { name, creator, members } = req.body;

//     req.body.groupChat = false;

//     if (members.length > 1) {
//       res.send({ message: "chat requires only one member ." });
//     }

//     const createChat = await chatModel.create({ ...req.body });

//     if (!createChat)
//       return res
//         .status(400)
//         .send({ message: "Error occured while adding message " });

//     res.status(200).send({ message: "chat created. " });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// };

exports.getPersonChats = async (req, res) => {
  try {
    const getPersonChats = [
      {
        $addFields: {
          member: { $arrayElemAt: ["$members", 0] }
        }
      },
      {
        $addFields: {
          member: { $toObjectId: "$member" }
        }
      },
      {
        $match: {
          groupChat: false,
          $or: [
            { creator: req.user._id },  
            { member: req.user._id }  
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "result"
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$result", 0] }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "member",
          foreignField: "_id",
          as: "oppUser"
        }
      },
      {
        $addFields: {
          oppUser: { $arrayElemAt: ["$oppUser", 0] }
        }
      },
      {
        $addFields: {
          _id: "$_id",
          name: "$name",
          groupChat: "$groupChat",
          user: "$user",
          member: "$oppUser"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          groupChat: 1,
          creator: "$user",
          member: 1
        }
      }
    ];

    const getChats = await chatModel.aggregate(getPersonChats);
    res.status(200).send({ data: getChats });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal in getPersonChats server error" });
  }
};
exports.editGroupName = async (req,res) =>{
  try {
    const { id} = req.params;
   const {name } = req.body
    const findId = await chatModel.findByIdAndUpdate( id,                      
    { $set: { name: name } },    
    { new: true }  );
   res.status(200).send({message:"Group name edited.",data:findId});
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Error occured please try again."})
  }
}

exports.addGroupMembers = async (req,res)=> {
  try { 

    const {id } = req.params;
    const {members } = req.body ;

    const findId = await chatModel.findByIdAndUpdate(
      id,                             
      { $push: { members: members } },  
      { new: true }                   
    );

     res.status(200).send({message:"Member added to the group.",data:findId});
    
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server Error"});
  }
}
exports.removeGroupMembers = async (req,res)=> {  
  try { 

    const {id } = req.params;
    const {members } = req.body ;

    const findId = await chatModel.findByIdAndUpdate(
      id,                             
      { $pull: { members: members } },  
      { new: true }                   
    );
     res.status(200).send({message:"Member Removed to the group.",data:findId});
    
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server Error"});
  }
}

//for dashboards
exports.getAllChats = async (req,res) =>{
  try { 
    const pipeline = [

      {
        $lookup: {
          from: "users",
          let: { id: "$creator" },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: ["$_id", "$$id"]
                    }
                  },
                  {
                    $expr: {
                      $eq: ["$isActive", true]
                    }
                  }
                ]
              }
            }
          ],
          as: "user"
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] }
        }
      },
      {
        $addFields: {
          userId: "$user._id",
          username: "$user.username"
        }
      },
      {
        $project: {
          user: 0,
          createdAt: 0,
          updatedAt: 0,
          isActive: 0,
          __v: 0
        }
      }
       
    ];
    const getChats = await chatModel.aggregate(pipeline);

    return res.status(200).send({message:"chat fetch",data:getChats});

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal in getAllChats server error" });
  }
}