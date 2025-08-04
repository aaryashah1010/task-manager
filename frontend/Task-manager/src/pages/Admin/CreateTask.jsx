// CreateTask.jsx
import React, { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from "react-hot-toast"
import { useLocation, useNavigate } from 'react-router-dom'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import SelectedUsers from '../../components/Inputs/SelectedUsers'
import TodoListInput from '../../components/Inputs/TodoListInput'
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput'
import DeleteAlert from '../../components/layout/DeleteAlert'
import Model from '../../components/Model'
const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(null);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item.text,
        completed: item.completed || false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task created successfully");
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

 const updateTask = async () => {
  setLoading(true);
  try {
    const todoList = taskData.todoChecklist?.map((item) => ({
      text: item.text,
      completed: item.completed || false,
    }));

    await axiosInstance.put(
      API_PATHS.TASKS.UPDATE_TASK(taskId),
      {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      }
    );
    toast.success("Task Updated Successfully");
  } catch (error) {
    console.error("Error updating task:", error);
    setError("Failed to update task");
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one checklist item");
      return;
    }

    if (taskId) {
      updateTask();
    } else {
      createTask();
    }
  };
const getTaskDetailsById = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
    if (response.data) {
      const taskInfo = response.data;

     setTaskData({
  title: taskInfo.title,
  description: taskInfo.description,
  priority: taskInfo.priority,
  dueDate: taskInfo.dueDate
    ? new Date(taskInfo.dueDate).toISOString().split("T")[0]
    : "",
  assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
  todoChecklist: taskInfo?.todoChecklist || [],
  attachments: taskInfo.attachments || [],
}); 
    }
  } catch (error) {
    console.error("Error fetching task:", error);
    toast.error("Failed to load task details");
  }
};

  const deleteTask=async()=>{
       try{
          await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
          setOpenDeleteAlert(false);
          toast.success("Task deleted succesfully");
          navigate('/admin/tasks');
       }
       catch(error){
            console.error("Error deleting task",error.response?.data?.message || error.message);
       }
  };
  useEffect(()=>{
    if(taskId){
       getTaskDetailsById(taskId)
    }
    return()=>{
    
    }
  },[taskId])

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [listening, setListening] = useState({ title: false, description: false });
  const recognitionRef = useRef(null);

  const handleVoiceInput = (field) => {
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
    }
    recognitionRef.current.onstart = () => setListening((prev) => ({ ...prev, [field]: true }));
    recognitionRef.current.onend = () => setListening((prev) => ({ ...prev, [field]: false }));
    recognitionRef.current.onerror = () => setListening((prev) => ({ ...prev, [field]: false }));
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleValueChange(field, transcript);
    };
    recognitionRef.current.start();
  };

  return (
    <div>
      <DashboardLayout activeMenu="Create Task">
        <div className='mt-5'>
          <div className='grid grid-cols md:grid-cols-4 mt-4'>
            <div className='form-card col-span-3'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl md:text-xl font-medium'>
                  {taskId ? "Update Task" : "Create Task"}
                </h2>
                {taskId && (
                  <button
                    className='flex items-center gap-1.5 text-[15px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                    onClick={() => setOpenDeleteAlert(true)}>
                    <LuTrash2 className='text-base' />
                    Delete
                  </button>
                )}
              </div>

              <div className='mt-4 flex items-center gap-2'>
                <label className='text-xs font-medium text-slate-600'>Task Title</label>
                <button
                  type="button"
                  onClick={() => handleVoiceInput("title")}
                  className={`ml-2 p-1 rounded-full ${listening.title ? "bg-green-200" : "bg-gray-200"}`}
                  title="Speak to fill"
                >
                  🎤
                </button>
              </div>
              <input
                placeholder='Create APP UI'
                className='form-input'
                value={taskData.title || ""}
                onChange={({ target }) => handleValueChange("title", target.value)} />

              <div className='mt-3 flex items-center gap-2'>
                <label className='text-xs font-medium text-slate-600'>Description</label>
                <button
                  type="button"
                  onClick={() => handleVoiceInput("description")}
                  className={`ml-2 p-1 rounded-full ${listening.description ? "bg-green-200" : "bg-gray-200"}`}
                  title="Speak to fill"
                >
                  🎤
                </button>
              </div>
              <textarea
                placeholder='Describe Task'
                className='form-input'
                rows={4}
                value={taskData.description || ""}
                onChange={({ target }) => handleValueChange("description", target.value)}
              />

              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>Due Date</label>
                <input
                  className='form-input'
                  type='date'
                  value={taskData.dueDate || ""}
                  onChange={({ target }) => handleValueChange("dueDate", target.value)}
                />
              </div>

              <div className='col-span-12 md:col-span-3'>
                <label className='text-xs font-medium text-slate-600'>Assign To</label>
                <SelectedUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange("assignedTo", value)}
                />
              </div>

              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>TODO Checklist</label>
                <TodoListInput
                  todoList={taskData.todoChecklist}
                  setTodoList={(value) => handleValueChange("todoChecklist", value)}
                />
              </div>

              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>Add Attachments</label>
                <AddAttachmentsInput
                  attachments={taskData.attachments}
                  setAttachments={(value) => handleValueChange("attachments", value)}
                />
              </div>

              {error && (
                <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
              )}

              <div className='flex justify-end mt-7'>
                <button
                  className='add-btn'
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {taskId ? "UPDATE TASK" : "CREATE TASK"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Model
          isOpen={openDeleteAlert}
          onClose={() => setOpenDeleteAlert(false)}
          title="Delete Task"
        >
          <DeleteAlert
            content="Are you sure you want to delete this task?"
            onDelete={() => deleteTask()}
          />
        </Model>
      </DashboardLayout>
    </div>
  );
};

export default CreateTask;
