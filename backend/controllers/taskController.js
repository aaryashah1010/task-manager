        const Task=require("../models/Task");

        //@desc get all tasks(admin:all ,user:only assigned tasks)
        //@route GET /api/tasks/
        //@access Private

    const getTasks = async (req, res) => {
    try {
        const { status } = req.query;

        // Initialize filter
        let filter = {};
        if (status) {
        filter.status = status;
        }

        let tasks;

        // 🔧 FIX 1: Use correct .populate() syntax
        if (req.user.role === "admin") {
        tasks = await Task.find(filter).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        } else {
        tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        }

        // 🔧 FIX 2: Map tasks to include completed checklist count
        tasks = await Promise.all(
        tasks.map(async (task) => {
            const completedCount = task.todoChecklist?.filter(
            (item) => item.completed
            ).length || 0;

            return {
            ...task._doc,
            completedTodoCount: completedCount,
            };
        })
        );

        // 🔧 FIX 3: Use same filter pattern for all dashboard stats
        const baseFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

        const allTasks = await Task.countDocuments(baseFilter);

        const pendingTasks = await Task.countDocuments({
        ...baseFilter,
        status: "Pending",
        });

        const inProgressTasks = await Task.countDocuments({
        ...baseFilter,
        status: "In Progress",
        });

        const completedTasks = await Task.countDocuments({
        ...baseFilter,
        status: "Completed",
        });

        // Final response
        res.json({
        tasks,
        statusSummary: {
            all: allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    };

        //@desc get task by id
        //@route GET /api/tasks/:id
        //@access Private
    const getTasksById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
        "assignedTo",
        "name email profileImageUrl"
        );

        if (!task) {
        return res.status(404).json({ message: "Task not found" }); // ✅ Fixed status code to 404
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    };

        //@desc Create a new task(Admin only)
        //@route POST /api/tasks/
        //private(admin)

        const createTask = async (req, res) => {
        try {
            const {
            title,
            description, // corrected
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
            } = req.body;

            if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "assignedTo must be an array of userIDs" });
            }

            const task = await Task.create({
            title,
            description, // corrected
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist
            });

            res.status(200).json({ message: "Task created successfully", task });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
        };


        //@desc update task
        //@route PUT /api/tasks/:id
        const updateTask=async(req,res)=>{
            const task=await Task.findById(req.params.id);
            if(!task){
                res.status(500).json({message:"Task not found"})
            }
            task.title=req.body.title||task.title;
            task.description=req.body.description||task.description;
            task.priority=req.body.priority||task.priority;
            task.dueDate=req.body.dueDate||task.dueDate;
            task.todoChecklist=req.body.todoChecklist||task.todoChecklist;
            task.attachments=req.body.attachments||task.attachments;

            if(req.body.assignedTo){
                if(!Array.isArray(req.body.assignedTo)){
                    return res.status(400).json({message:"this is not a user find"})
                }
                task.assignedTo=req.body.assignedTo;
            }
            const updateTask=await task.save();
            res.json({message:"Task updated succesfully",updateTask})
        }

        //@desc delete a task(Admin only)
        //@route POST /api/tasks/
        //private(admin)

        const deleteTask=async(req,res)=>{
            try{
                const task=await Task.findById(req.params.id);
                if(!task){
                    return res.status(400).json({message:"Task not found"});
                }
                await task.deleteOne();
                res.status(200).json({message:"Task deleted succesfully"})
            }
            catch(error){
                res.status(404).json({message:"Server error"});
            }
        }


        //@desc update task status
        //@route PUT /api/tasks/:id/status 
        //private


    const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id); 

        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        const isAssigned = task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
        }

        task.status = req.body.status || task.status;

        if (task.status === "Completed") {
        task.todoChecklist.forEach((item) => {
            item.completed = true;
        });
        task.progress = 100;
        }

        await task.save();
        res.json({ message: "Task status updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    };

        //@desc update task checklists
        //@route DELETE /api/tasks/:id/todo
        //private


   const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Clean assignment (remove _id to avoid merge issues)
    task.todoChecklist = todoChecklist.map(item => ({
      text: item.text,
      completed: item.completed === true,
    }));

    // ✅ Recalculate progress
    const completedCount = task.todoChecklist.filter(item => item.completed).length;
    const totalItems = task.todoChecklist.length;
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // ✅ Update status based on progress
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    console.error("Checklist update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


        

        //@desc Dashboard Data(Admin only)
        //@route DELETE /api/tasks/dashboard-data
        //private


       const getDashboardData = async (req, res) => {
  try {
    // 🔢 Total number of tasks
    const totalTasks = await Task.countDocuments();

    // 🔢 Number of tasks by status
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });

    // ❗ Overdue = due date has passed and task is not completed
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // 📊 Task Distribution by Status (for Pie/Bar chart)
    const taskStatuses = ["Pending", "In Progress", "Completed"];

    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // "In Progress" → "InProgress"
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    // 📊 Task Count by Priority (Low, Medium, High)
    const taskPriorities = ["Low", "Medium", "High"];

    // ❗ FIXED TYPO: "aggreagate" ➜ "aggregate"
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {}); 

    // 🕒 Get latest 10 created tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 }) // Descending order
      .limit(10)
      .select("title status priority dueDate createdAt");

    // ✅ Send dashboard data
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    // ❗ Proper error handling
    console.error("Dashboard fetch failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


        //@desc Dashboard Data (User-specific)
        //@route Get /api/tasks/user-dashboard-data
        //@access Private

        const getUserDashboardData=async(req,res)=>{
            try{
                const userId=req.user._id; //only for logged in user

                //fetch statistics for this data
                const totalTasks=await Task.countDocuments({assignedTo:userId});
                const pendingTasks=await Task.countDocuments({
                    assignedTo:userId,
                    status:"Pending"
                });
                const completedTasks=await Task.countDocuments({
                    assignedTo:userId,
                    status:"Completed"
                });
                const overdueTasks=await Task.countDocuments({
                    assignedTo:userId,
                    status:{$ne:"Completed"},
                    dueDate:{$lt:new Date()}
                })
                //Task distribution by status
                const taskStatuses=["Pending","In Progress","Completed"];
                const tasksDistributionRaw=await Task.aggregate([
                    {$match:{assignedTo:userId}},
                    {$group:{_id:"$status",count:{$sum:1}}},
                ]);
                 const taskDistribution = taskStatuses.reduce((acc, status) => {
                const formattedKey = status.replace(/\s+/g, ""); // "In Progress" → "InProgress"
                acc[formattedKey] =
                    tasksDistributionRaw.find((item) => item._id === status)?.count || 0;
                return acc;
                }, {});
                taskDistribution["All"]=totalTasks;
                //task distribution by priority
                const taskPriorities=["Low","Medium","High"];
                const taskPriorityLevelsRaw=await Task.aggregate([
                    {$match:{assignedTo:userId}},
                    {$group:{_id:"$priority",count:{$sum:1}}},

                ]);
                const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>{
                    acc[priority]=taskPriorityLevelsRaw.find((item)=>item._id===priority)?.count||0;
                    return acc;
                }, {});
                //fetch recent 10
                const recentTasks=await Task.find({ assignedTo: userId })
                .sort({createdAt:-1})
                .limit(10)
                .select("title status priority dueDate createdAt");
                res.status(200).json(
                    {
                        statistics:{
                            totalTasks,
                            pendingTasks,
                            completedTasks,
                            overdueTasks,
                        },
                        charts:{
                            taskDistribution,
                            taskPriorityLevels,
                        },
                        recentTasks,     
                    }
                );
            }
            catch(error){
                  console.error("Dashboard fetch failed:", error);
                  res.status(500).json({ message: "Server error", error: error.message });
            }
        }


        module.exports={getTasks, getTasksById,createTask,updateTask,deleteTask,updateTaskStatus,updateTaskChecklist,getDashboardData,getUserDashboardData}