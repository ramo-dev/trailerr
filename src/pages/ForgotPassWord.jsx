
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import Background from "../assets/movie.jpg"
import GoBackBtn from '../components/GoBackBtn';
import { Link } from 'react-router-dom';
import { useThemeStore } from "../store/store";
import useAuthState from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Separator } from '@radix-ui/themes';

const ForgotPass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { isDark } = useThemeStore();
  const { user, login, loading, error } = useAuthState();
  const navigate = useNavigate();


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
    login(formData.email, formData.password);
    setTimeout(() => {
      navigate('/')
    }, 2000)
    console.log(user);
  };

  return (
    <div
      style={{ backgroundImage: `url(${Background})` }}
      className="min-h-screen flex items-center justify-center bg-black/20 ">
      <GoBackBtn />
      <div className={`${isDark ? "from-black to-transparent" : "from-white/50 to-transparent"} absolute inset-0 h-full bg-gradient-to-b `} aria-hidden="true" />
      <div className={`${isDark ? "bg-black/80  text-white" : "bg-white  text-black"} relative md:p-8 px-4 py-20 md:rounded-lg md:shadow-md w-full max-w-md md:h-fit h-screen`}>
        <h2 className="text-2xl font-bold mb-6">Enter email to reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 my-3 ">
          {error && <p className="text-red-500 text-sm">{error}</p>}
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 text-center rounded-md  transition duration-300`}
          >
            {loading ? <Loader className='animate-spin mx-auto' /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
