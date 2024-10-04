import { Button, Avatar, IconButton, Popover, Flex, TextArea, Checkbox } from "@radix-ui/themes";

import Search from "./Search";
import { Link } from "react-router-dom";
import { List, Loader, LogOut, Moon, Popcorn, Sun, User } from "lucide-react";
import { useThemeStore } from "../store/store";
import useAuthState from "../hooks/useAuth";

export default function Navbar() {

  //Get state and function to toggle Theme
  const { isDark, toggleTheme } = useThemeStore();
  //Get the current user, loading state and function to log out current user
  const { user, loading, logout } = useAuthState();



  return (
    <nav className={`${isDark ? "bg-black" : "bg-white"} duration-200 ease-in-out delay-1 p-4 sticky top-0 z-10 px-4`}>
      <div className=" mx-auto flex justify-between items-center">
        <Link to="/" className={`${isDark ? "text-white" : "text-black"} text-2xl font-semibold`}>
          <Popcorn className="h-8 w-8" />
          <p className="sr-only">Trailerr</p>
        </Link>
        <div className="ms-auto me-5">
          <Search />
        </div>
        <div className="flex space-x-4">
          <IconButton onClick={toggleTheme}
            variant="solid"
            size="3"
            radius="full"
            className="cursor-pointer border-blue-500">
            {isDark ? <Sun /> : <Moon />}
          </IconButton>

          {user ? (
            loading ? <Loader /> :
              <Popover.Root>
                <Popover.Trigger>
                  <IconButton
                    radius="full"
                    size="3"
                    variant="surface"
                  >
                    <Avatar
                      src={user?.photoURL}
                      fallback={user?.displayName ? user.displayName[0] : "?"}

                    />

                  </IconButton>
                </Popover.Trigger>
                <Popover.Content width="200px"
                  className={`flex flex-col gap-2 ${isDark ? "!bg-black" : ""}`}>
                  <Link to="/u/mylist" className="w-full">
                    <Button variant="solid" className="!w-full flex-1 !flex !justify-start">
                      <List />
                      My List
                    </Button>
                  </Link>
                  <Link to="/u/profile" className="w-full">

                    <Button variant="solid" className="!w-full !flex !justify-start">
                      <User />
                      Profile
                    </Button></Link>

                  <Button
                    onClick={logout}
                    variant="solid"
                    color="red"
                    className="!flex !justify-start"
                  >
                    <LogOut />
                    Logout
                  </Button>

                </Popover.Content>
              </Popover.Root>
          ) : (
            !user ? <Link to="login">
              <Button variant="solid" size="3" className="!w-32 bg-blue-500 text-white">
                Login
              </Button>
            </Link>
              : <Loader className="animate-spin" />
          )}
        </div>
      </div>
    </nav>
  );
}
