import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import Background from "../assets/movie.jpg"
import GoBackBtn from '../components/GoBackBtn';
import { Link } from 'react-router-dom';
import { useThemeStore } from "../store/store";
import useAuthState from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  //State of theme from useThemeStore hook
  const { isDark } = useThemeStore();

  //Current user and auth actions to perform actions on user
  const { user, login, loading, error, signInWithGoogle } = useAuthState();

  //Hook by RRD to redirect user based on state
  const navigate = useNavigate();

  //function to show/hide password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  //function to handle change in input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  //Submit function to login user
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    if (error) {
      toast.error("Invalid email or Password");
    }
  };

  //side effect to redirect user to home if logged in
  useEffect(() => {
    if (user?.email) {
      navigate('/')
    }

  }, [user]);

  //Login function to add user using the google sign in with popup
  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
      toast.success("Sign in Successful");
    } catch (err) {
      toast.error("Error signing in with Google")
    }
  }


  return (
    <div
      style={{ backgroundImage: `url(${Background})` }}
      className="min-h-screen flex items-center justify-center bg-black/20 ">
      <GoBackBtn />
      <div className={`${isDark ? "from-black to-transparent" : "from-white/50 to-transparent"} absolute inset-0 h-full bg-gradient-to-b `} aria-hidden="true" />
      <div className={`${isDark ? "bg-black/80  text-white" : "bg-white  text-black"} relative md:p-8 px-4 py-20 md:rounded-lg md:shadow-md w-full max-w-md md:h-fit h-screen`}>
        <h2 className="text-3xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 my-3 ">
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
          <div className="flex items-end justify-end">

            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 text-center rounded-md  transition duration-300`}
          >
            {loading ? <Loader className='animate-spin mx-auto' /> : "Login"}
          </button>
        </form>
        <small className='flex justify-center my-2'>or</small>
        <button
          onClick={handleSignInWithGoogle}
          className={`my-2 w-full ${loading ? "bg-gray-600" : "bg-neutral-600 hover:bg-neutral-800"} text-white py-2 text-center rounded-md  transition duration-300`}
        >
          Google
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <Link to="/register"
            onClick={() => {/* Handle navigation to signup page */ }}
            className="ml-1 text-blue-600 hover:underline focus:outline-none"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
