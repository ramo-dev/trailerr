import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Background from "../assets/movie.jpg"
import useThemeStore from '../store/ThemeStore';
import GoBackBtn from '../components/GoBackBtn';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { isDark } = useThemeStore();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the login data to your backend
    console.log('Login submitted:', formData);
  };

  return (
    <div
      style={{ backgroundImage: `url(${Background})` }}
      className="min-h-screen flex items-center justify-center bg-black/20 ">
      <GoBackBtn />
      <div className={`${isDark ? "from-black to-transparent" : "from-white/50 to-transparent"} absolute inset-0 h-full bg-gradient-to-b `} aria-hidden="true" />
      <div className={`${isDark ? "bg-black/80  text-white" : "bg-white  text-black"} relative md:p-8 px-3 py-20 md:rounded-lg md:shadow-md w-full max-w-md md:h-fit h-screen`}>
        <h2 className="text-3xl font-bold mb-6 md:text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="text-black w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="text-black w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <button
            onClick={() => {/* Handle navigation to signup page */ }}
            className="ml-1 text-blue-600 hover:underline focus:outline-none"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
