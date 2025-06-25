const express = require("express")
const {protect,adminOnly}=require("../middlewares/authMiddleware.js")
const {getDashboardData,getUserDashboardData,getTasks,getTasksById,createTask,deleteTask,updateTask,updateTaskChecklist,updateTaskStatus} =require("../controllers/taskController.js")
const router=express.Router();

//Task manager
router.get("/dashboard-data",protect,getDashboardData);
router.get("/user-dashboard-data",protect,getUserDashboardData);
router.get("/",protect,getTasks);//get all task
router.get("/:id",protect,getTasksById);
router.post("/",protect,adminOnly,createTask);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,adminOnly,deleteTask);
router.put("/:id/status",protect,updateTaskStatus);
router.put("/:id/todo",protect,updateTaskChecklist);

module.exports=router;  
