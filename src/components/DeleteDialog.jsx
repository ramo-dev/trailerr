import { Button, Dialog, Flex, Spinner, Text } from "@radix-ui/themes";
import useUpdateProfile from "../hooks/useUpdateProfile";
import { useThemeStore } from "../store/store";
import { useState } from "react";
import useAuthState from "../hooks/useAuth";
import { toast } from "sonner";

const DeleteDialog = () => {
  const { deleteAccount, error } = useUpdateProfile();  // Added error state for better feedback
  const { isDark } = useThemeStore();
  const { loading } = useAuthState();
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState("");  // Added password state


  const handleDelete = async () => {
    if (confirmed && password) {
      const { success, message } = await deleteAccount(password);

      if (!success) {
        // Display the error toast and log the error message
        toast.error(message || "Invalid credentials, please try again");
      } else {
        toast.success("Account deleted successfully");
      }
    }
  };


  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className={`w-full py-2 rounded-md mt-4 ${isDark ? "bg-red-700 text-white" : "bg-red-500 text-white"}`}>
          Delete Account
        </button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px" className={`${isDark ? "!bg-black/90 text-white" : "bg-white text-black"} p-6 rounded-lg shadow-lg`}>
        <Text className="text-lg font-semibold">
          Are you sure you want to delete your account? This action cannot be undone!
        </Text>

        {/* Confirmation Checkbox */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="confirmDelete"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="confirmDelete" className="text-sm">
            Yes, I want to delete my account
          </label>
        </div>

        {/* Password Input */}
        <div className="mt-4">
          <label htmlFor="password" className="text-sm block mb-2">
            Enter your password to confirm:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 rounded-md ${isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
            placeholder="Password"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}  {/* Display error message if any */}

        <Flex justify="between" className="mt-6 gap-3">
          <Dialog.Close asChild>
            <Button className={`${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} !flex-1 rounded-md`}>
              Cancel
            </Button>
          </Dialog.Close>

          {/* Delete Button */}
          <Button
            color="red"
            onClick={handleDelete}
            className={`rounded-md !flex-1 ${confirmed && password ? "bg-red-600 text-white" : "!bg-gray-300 text-white cursor-not-allowed"}`}
            disabled={!confirmed || !password}  // Disable button if not confirmed or no password
          >
            {loading ? <Spinner /> : "Delete Account"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteDialog;
