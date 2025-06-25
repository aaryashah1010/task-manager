const Task=require("../models/Task")
const User=require("../models/User")
const bcrypt=require("bcryptjs");


//@desc Get all users
//@route GET /api/users
//@access Private(Admin)
const getUsers=async (req,res)=>{
    try{
        const users=await User.find({
            role:'member'
        }).select("--password");
// add task to each users
        const usersWithTaskCounts= await Promise.all(users.map(async(user)=>{
            const pendingTasks=await Task.countDocuments({assignedTo:user._id,status:"Pending"})
            const inProgressTasks=await Task.countDocuments({assignedTo:user._id,status:"In Progress"})
            const completedTasks=await Task.countDocuments({assignedTo:user._id,status:"Completed"})
       
        return {
            ...user._doc,//include all exisitng user data
            pendingTasks,
            inProgressTasks,
            completedTasks,
        };
     }));
     res.json(usersWithTaskCounts);
        
    }
    catch(error){
        res.status(500).json({message:"Server error",error:error.message});
    }
}

//@desc get user by id
//@route /api/users/:id
//access private 
const getUserById=async(req,res)=>{
     try{
      const user=await User.findById(req.user.id).select("--password");
      if(!user){
        res.status(500).json({message:"User does not exists"})
      }
      res.json(user);
    }
    catch(error){
        res.status(500).json({message:"Server error",error:error.message});
    }
}

//@desc delete user by id
//@route /api/users/:id
//access private(ADMIN)


module.exports={getUsers,getUserById};
