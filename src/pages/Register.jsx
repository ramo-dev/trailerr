import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Loader } from 'lucide-react';
import Background from "../assets/movie.jpg"
import { useThemeStore } from '../store/store';
import GoBackBtn from '../components/GoBackBtn';
import { Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import useAuthState from '../hooks/useAuth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',

  });
  const { isDark } = useThemeStore();
  const { register, loading, error } = useAuthState();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  async function newUser() {
    const user = await register(formData.username, formData.email, formData.password)
    console.log(user);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    newUser();
  };

  useEffect(() => {
    console.log(error);
  }, [error])

  return (
    <div
      style={{ backgroundImage: `url(${Background})` }}
      className="min-h-screen flex items-center justify-center bg-black/20 ">
      <GoBackBtn />
      <div className={`${isDark ? "from-black to-transparent" : "from-white/50 to-transparent"} absolute inset-0 h-full bg-gradient-to-b `} aria-hidden="true" />
      <div className={`${isDark ? "bg-black/80  text-white" : "bg-white  text-black"} relative md:p-8 px-4 py-20 md:rounded-lg md:shadow-md w-full max-w-md md:h-fit h-screen`}>
        <h2 className="my-6 text-center text-3xl font-extrabold">
          Create your account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 my-6">

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="text-black w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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


          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700 "} text-white py-2 text-center rounded-md transition duration-300`}
          >
            {loading ? <Loader className='animate-spin mx-auto' /> : "Register"}
          </button>

        </form>
        <p className="mt-4 text-center text-sm text-gray-600">

          Already have an account?
          <Link to="/login"
            onClick={() => {/* Handle navigation to signup page */ }}
            className="ml-1 text-blue-600 hover:underline focus:outline-none"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
