import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthState from "../hooks/useAuth";
import { useThemeStore } from "../store/store";
import Loader from "../components/Loading";
import { Camera } from "lucide-react";
import DeleteDialog from "../components/DeleteDialog";

export default function Settings() {
  const { user, loading } = useAuthState();
  const [profileImage, setProfileImage] = useState("https://trailerr.vercel.app/assets/error-DIg_61Dp.jpg");
  const { isDark } = useThemeStore();
  const fileInputRef = useRef(null);
  const navigate = useNavigate()

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return <Loader />
  }
  if (!user && !loading) {
    navigate('/')
    return null
  }

  return (
    <div className={`${isDark ? "bg-black text-white" : "bg-white"} md:overflow-show overflow-hidden`}>
      <div className="md:flex h-screen max-w-4xl mx-auto overflow-y-auto no-scroll">
        <aside className="md:sticky top-0 md:top-20 md:h-screen h-max w-[60vh] rounded-md p-4">
          <form className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                src={user.photoURL || profileImage}
                alt={`${user?.displayName}`}
                className="h-[250px] w-[250px] rounded-full object-cover"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleCameraClick}
              >
                <Camera className="text-white" size={48} />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user?.displayName}</h2>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-md">Save changes</button>
          </form>
        </aside>      <main className="flex-1 md:p-6 px-3">
          <div className="mx-auto md:max-w-3xl w-full space-y-8">
            <h1 className="text-3xl font-bold md:ms-4">Account Settings</h1>
            <div className="md:p-4 p-1 rounded-md shadow">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block font-medium">First Name</label>
                  <input
                    id="firstName"
                    value={user?.displayName}
                    className="border rounded-md p-2 w-full text-black"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <label htmlFor="email" className="block font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={user?.email}
                  className="border rounded-md p-2 w-full text-black"
                />
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-4">Save Changes</button>
            </div>

            <div className="md:p-4 p-1 rounded-md shadow">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <div className="space-y-2 mt-4">
                <label htmlFor="currentPassword" className="block font-medium">Current Password</label>
                <input id="currentPassword" type="password" className=" text-black border rounded-md p-2 w-full" />
              </div>
              <div className="space-y-2 mt-4">
                <label htmlFor="newPassword" className="block font-medium">New Password</label>
                <input id="newPassword" type="password" className="text-black border rounded-md p-2 w-full" />
              </div>
              <div className="space-y-2 mt-4">
                <label htmlFor="confirmPassword" className="block font-medium">Confirm Password</label>
                <input id="confirmPassword" type="password" className="text-black border rounded-md p-2 w-full" />
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-4">Change Password</button>
            </div>

            <div className="md:p-4 p-1 rounded-md shadow">
              <h2 className="text-xl font-semibold">Security</h2>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="font-medium">Login Activity</p>
                  <p className="text-sm text-gray-500">View and manage your login history.</p>
                </div>
                <Link to="#" className="text-blue-500 hover:underline">View Activity</Link>
              </div>
            </div>

            <div className="md:p-4 p-1 rounded-md shadow">
              <h2 className="text-xl font-semibold">Delete Account</h2>
              <p className="text-sm text-gray-500 mt-4">
                Deleting your account is a permanent action. All your data and account information will be permanently removed.
              </p>
              <DeleteDialog />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
