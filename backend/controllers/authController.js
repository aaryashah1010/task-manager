const User=require("../models/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");

const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
};

//@desc register a user
//@route /api/auth/register
//@access public
const registerUser=async(req,res)=>{
   try{
      const {name,email,password,profileImageUrl,adminInviteToken}=
      req.body;

      //check if user exists
      const userExists=await User.findOne({email});
      if(userExists){
        return res.status(500).json({message:"User already exists"});
      }
      //determine user role:Admin if correct token is there,otherwise member
      let role="member";
      if(adminInviteToken && adminInviteToken==process.env.ADMIN_INVITE_TOKEN){
        role="admin";
      }
     //Hash password
     const salt=await bcrypt.genSalt(10);
     const hashedPassword=await bcrypt.hash(password,salt);

     //create new user
     const user=await User.create({
        name,
        email,
        password:hashedPassword,
        profileImageUrl,
        role,
     });
     //Return user data with JWT
     res.status(201).json(
        {
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id),
            
        }
     );
   }
   catch(error){
     res.status(500).json({message:"Server error",error:error.message});
   }
};

//@desc login a user
//@route /api/auth/login
//@access private(requires jwt)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not registered or invalid email and password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Return user data with JWT
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


//@desc get user profile
//@route /api/auth/profile
//@access Private(requeires jwt)

const getUserProfile=async(req,res)=>{
   try{
      const user= await User.findById(req.user.id).select("--password");
      if(!user){
        res.status(401).json({message:"Unable to find the user"});
      }
      res.json(user);
   }
   catch(error){
     res.status(500).json({message:"Server error",error:error.message});
   }
};

//@desc update user profile
//@routes /api/auth/profile
//requeire jwt

const updateUserProfile=async(req,res)=>{
    try{
      const user=await User.findById(req.user.id);
      if(!user){
        return res.status(500).json({message:"User not found"});
      }
      user.name=req.body.name||user.name;
      user.email=req.body.email||user.email;
      if(req.body.password){
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(req.body.password,salt);
      }
      const updatedUser=await user.save();
      return res.json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        role:updatedUser.role,
        token:generateToken(updatedUser._id)
      })
   }
   catch(error){
     res.status(500).json({message:"Server error",error:error.message});
   }
};

module.exports={registerUser,loginUser,getUserProfile,updateUserProfile};