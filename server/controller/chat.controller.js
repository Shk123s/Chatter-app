
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
      return res.status(404).send({message:"Chat already exists",data:fetchChat});
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
const giveAvatar = () => {
  const avatars = [
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA9KoGRKSp6E7yyK4YhDkr1zf9VRANuK5ogJT-GDa8ELZEUQwJJ2wIBEM&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg12fmWhH0dFfmJCyc3tXtu_TxDGFDKWqQePikPIzapJO4XrhA0o14qe4&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Q8_PQJOWolfPT1d8KKlb36K1l5IPCQZYrMpJCJvyjCdP-Wjhpouw5Cc&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5r2IRcBIyCEvijeKfYbmKIN67Espeyx8qMK7DfvjFBhgriI2B2f952LIi3A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA-20fQNZmEtBJ3IGDynYiZ7uUj5cHiXnJ95GinIXlhxjP479zEOVW40k&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOZr4M1BciX-PLXnAWTjwzqKd4UfKLDr3rw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYHwAOQLyySbuK-Ptq2pJUPBaO2ja7dF-L_A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2iWPO8hVH-A2tlSSq4Z1sTSdfHt8zN_VIMJF-htXSYyd-pcnkVw3WDcKr2W9YGTcQgDs&usqp=CAU"
  ];
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
}
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
exports.getAllConversation = async(req,res) =>  
{
  try {
    const userId = req.user._id;
  
    const findConversation = await chatModel.aggregate([
      {
        $match: {
          $or: [
            {
              members:userId
            },
            {
              creator:userId
            }
          ],
          isDeleted: false,
          isActive: true
        }
      },
      {
        $addFields: {
          firstMember: {
            $arrayElemAt: ["$members", 0]
          }
        }
      },
      {
        $addFields: {
          firstMemberId: {
            $toObjectId: "$firstMember"
          }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { memberId: "$firstMemberId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$memberId"] } } },
            { $project: { username: 1,avatar:1,createdAt:1 } }
          ],
          as: "messageUser"
        }
      },
      {
        $addFields: {
          messageUser: {
            $arrayElemAt: ["$messageUser", 0]
          }
        }
      },
      {
        $project: {
          groupChat: 1,
          name: 1,
          createdAt:1,
          messageUser: {
            $cond:{
              if:{$eq:["$groupChat",true]},
              then:"$$REMOVE",
              else:"$messageUser"
            }
          },
          
        }
      }
    ]);

    res.status(200).send({ message: findConversation });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server error."});
  }
}

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