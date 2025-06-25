import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Admin/Dashboard'
import PrivateRoute from './routes/PrivateRoute' // Make sure this component exists
import { Outlet } from 'react-router-dom'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ManageUsers from './pages/Admin/ManageUsers'
import UserDashboard from './pages/Users/Dashboard'
import MyTasks from './pages/Users/MyTasks'
import ViewTaskDetails from './pages/Users/ViewTaskDetails'
import UserProvider, { UserContext } from "./context/userContext"
const App = () => {
  return (
    <UserProvider>
           <div>
         <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

        {/* Admin routes protected by PrivateRoute */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-task" element={<CreateTask/>} />
          <Route path="/admin/users" element={<ManageUsers/>} />
        </Route>

         {/* User routes protected by PrivateRoute */}
        <Route element={<PrivateRoute allowedRoles={["member"]} />}>
          <Route path="/member/dashboard" element={<UserDashboard />} />
          <Route path="/member/tasks" element={<MyTasks/>} />
          <Route path="/member/tasks-details/:id" element={<ViewTaskDetails/>} />
        </Route>
          
          <Route path='/' element={<Root/>}></Route>
      </Routes>
    </Router>
    </div>
    </UserProvider>
   
   
  )
};
const Root=()=>{
  const {user,loading}=useContext(UserContext);
  if(loading){
    return <Outlet/>
  }
  if(!user){
    return <Navigate to="/login" />;
  }
 return user.role === "admin"
  ? <Navigate to="/admin/dashboard" />
  : <Navigate to="/member/dashboard" />;
}

export default App
