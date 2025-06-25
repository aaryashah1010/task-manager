// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {protect,adminOnly}=require("../middlewares/authMiddleware.js")
const {getUsers,getUserById}=require("../controllers/userController.js")
//user managemaent routes
router.get("/",protect,getUsers);
router.get("/:id",protect,getUserById);

module.exports = router;
