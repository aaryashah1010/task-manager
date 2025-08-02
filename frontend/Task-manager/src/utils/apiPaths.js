export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user (Admin or member)
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile"
  },
  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users (admin)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user (admin)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update a user
    DELETE_USER: (userId) => `/api/users/${userId}`  // Delete a user
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASK_BY_ID: (taskID) => `/api/tasks/${taskID}`,
    CREATE_TASK:"/api/tasks",
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,
    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`
  },
  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users"
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image"
  }
};
