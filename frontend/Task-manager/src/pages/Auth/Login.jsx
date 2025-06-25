import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {updateUser}=useContext(UserContext)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token); // ✅ fixed
        updateUser(response.data)
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/member/dashboard");
        }
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // ✅ fixed
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-full flex flex-col justify-center px-2">
        <h3 className="text-3xl font-semibold text-black mb-2">Welcome Back</h3>
        <p className="text-base text-slate-700 mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && (
            <p className="text-red-500 text-sm -mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-2 mt-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded"
          >
            LOGIN
          </button>

          <p className="text-sm text-slate-800 text-center mt-4">
            Don't have an account?{" "}
            <Link
              className="font-medium text-primary underline hover:text-blue-700"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
