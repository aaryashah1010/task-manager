const express = require("express");
const router = express.Router();
const upload=require("../middlewares/uploadMiddleware.js")
// 🧩 Import controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");

// 🔐 Import middleware for authentication
const { protect, adminOnly } = require("../middlewares/authMiddleware.js");

// 📌 Auth Routes
router.post("/register", registerUser);               // Register new user
router.post("/login", loginUser);                     // Login
router.get("/profile", protect, getUserProfile);      // Get profile (requires token)
router.put("/profile", protect, updateUserProfile);   // Update profile (requires token)

router.post("/upload-image",upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"No file uploaded"})
    }
    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`
    res.status(200).json({imageUrl})
})

module.exports = router;