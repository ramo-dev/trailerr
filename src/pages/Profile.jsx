import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthState from "../hooks/useAuth";
import { useThemeStore } from "../store/store";
import Loader from "../components/Loading";
import { Camera } from "lucide-react";
import DeleteDialog from "../components/DeleteDialog";
import { toast } from "sonner";
import useUpdateProfile from "../hooks/useUpdateProfile";

export default function Settings() {
  const { user, loading } = useAuthState();
  const [profileImage, setProfileImage] = useState("https://trailerr.vercel.app/assets/error-DIg_61Dp.jpg");
  const { isDark } = useThemeStore();
  const { updateDetails } = useUpdateProfile();
  const [form, setForm] = useState({
    displayName: '',
  })

  //reference to the file input to manipulate using jsx and state
  const fileInputRef = useRef(null);


  //a RRD hook to redirect users based on state
  const navigate = useNavigate()


  //Placeholder function to change user profile pic
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


  //function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  //function to handle submition 
  async function handleSubmit(e) {
    e.preventDefault();

    const { displayName } = form;
    if (displayName) {
      const response = await updateDetails(displayName);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  }



  //placeholder function to avoid page refresh on submit
  function handleImageSub(e) {
    e.preventDefault();
  }






  //Placeholder function to change user profile pic
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };


  //Render loading incase of change in loading state or user fetching action
  if (loading) {
    return <Loader />
  }


  //Redirect to home if not loading and no user, also returns null screen to avoid ui malfunctions
  if (!user && !loading) {
    navigate('/')
    return null
  }

  return (
    <div className={`${isDark ? "bg-black text-white" : "bg-white"} md:overflow-show overflow-hidden`}>
      <div className="md:flex h-screen max-w-4xl mx-auto overflow-y-auto no-scroll">
        <aside className="md:sticky top-0 md:top-20 md:h-screen h-max w-[60vh] rounded-md p-4">
          <form className="flex flex-col items-center space-y-4" onSubmit={handleImageSub}>
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
              <h2 className="text-3xl font-semibold">{user?.displayName}</h2>
              <h2 className="text-xl my-4">{user?.email}</h2>

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
        </aside>
        <main className="flex-1 md:p-6 px-3">
          <div className="mx-auto md:max-w-3xl w-full space-y-8">
            <h1 className="text-3xl font-bold md:ms-4">Account Settings</h1>
            <form className="md:p-4 p-1 rounded-md shadow" onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block font-medium">Name</label>
                  <input
                    name="displayName"
                    value={form.displayName}
                    onChange={handleChange}
                    className="border rounded-md p-2 w-full text-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md mt-4">Save Changes</button>
            </form>


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
