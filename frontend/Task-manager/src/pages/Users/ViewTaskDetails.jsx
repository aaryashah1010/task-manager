import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axiosInstance';// <-- ADD THIS LINE
import { STATUS_DATA } from '../../utils/data'
import AvatarGroup from '../../components/AvatarGroup'
import Progress from '../../components/layout/Progress'
import moment from 'moment'
import { UserContext } from '../../context/userContext'

const ViewTaskDetails = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [checklist, setChecklist] = useState([])
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingChecklist, setUpdatingChecklist] = useState(false)
  const { user } = useContext(UserContext)

  // Fetch task details
  const getTaskDetailsById = async (taskId) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))
      if (response.data) {
        setTask(response.data)
        setStatus(response.data.status)
        setChecklist(response.data.todoChecklist || [])
      }
    } catch (error) {
      console.error("Error fetching task details:", error)
    } finally {
      setLoading(false)
    }
  }

  // Update task status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setUpdatingStatus(true)
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(id), { status: newStatus })
      // Refetch task to get updated status/progress/checklist
      await getTaskDetailsById(id)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Update checklist item completion
  const handleChecklistToggle = async (idx) => {
    const updatedChecklist = checklist.map((item, i) =>
      i === idx ? { ...item, completed: !item.completed } : item
    )
    setChecklist(updatedChecklist)
    setUpdatingChecklist(true)
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id), {
        todoChecklist: updatedChecklist
      })
      // Refetch task to get updated progress/status
      await getTaskDetailsById(id)
    } catch (error) {
      console.error("Error updating checklist:", error)
    } finally {
      setUpdatingChecklist(false)
    }
  }

  useEffect(() => {
    if (id) {
      getTaskDetailsById(id)
    }
    // eslint-disable-next-line
  }, [id])

  if (loading || !task) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="p-8 text-center text-gray-500">Loading task details...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{task.title}</h2>
          <div className={`px-3 py-1 rounded text-sm font-medium ${getStatusTagColor(task.status)}`}>
            {task.status}
          </div>
        </div>
        <div className="mb-2 text-gray-700">{task.description}</div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <span className="font-medium text-gray-600">Priority: </span>
            <span>{task.priority}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Due Date: </span>
            <span>{moment(task.dueDate).format('Do MMM YYYY')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Created: </span>
            <span>{moment(task.createdAt).format('Do MMM YYYY')}</span>
          </div>
        </div>
        <div className="mb-4">
          <span className="font-medium text-gray-600">Assigned To: </span>
          <AvatarGroup avatars={task.assignedTo?.map(u => u.profileImageUrl)} />
        </div>
        <div className="mb-4">
          <span className="font-medium text-gray-600">Attachments: </span>
          {task.attachments && task.attachments.length > 0 ? (
            <ul className="list-disc ml-6">
              {task.attachments.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={file.url || file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {file.name || file.split('/').pop()}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400">No attachments</span>
          )}
        </div>
        <div className="mb-4">
          <span className="font-medium text-gray-600">Progress: </span>
          <Progress progress={task.progress || 0} status={task.status} />
        </div>
        <div className="mb-6">
          <label className="block font-medium text-gray-600 mb-2">Status:</label>
          <select
            className="border rounded px-3 py-2"
            value={status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
          >
            {STATUS_DATA.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium text-gray-600 mb-2">Checklist:</label>
          <ul>
            {checklist.length === 0 && (
              <li className="text-gray-400">No checklist items</li>
            )}
            {checklist.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleChecklistToggle(idx)}
                  disabled={updatingChecklist}
                />
                <span className={item.completed ? "line-through text-gray-400" : ""}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper for status tag color
function getStatusTagColor(status) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default ViewTaskDetails