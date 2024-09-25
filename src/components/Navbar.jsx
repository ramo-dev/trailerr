import { Button, Avatar, IconButton, Popover, Flex, TextArea, Checkbox } from "@radix-ui/themes";

import Search from "./Search";
import { Link } from "react-router-dom";
import { Box, FilmIcon, Loader, Moon, Popcorn, Sun } from "lucide-react";
import { useThemeStore } from "../store/store";
import useAuthState from "../hooks/useAuth";
import { useEffect } from "react";

export default function Navbar() {

  const { isDark, toggleTheme } = useThemeStore();
  const { user, loading, logout } = useAuthState();

  useEffect(() => {
    console.log(user);
  }, [])

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
                      src={user.photoURL}
                      fallback={user.displayName[0]}

                    />

                  </IconButton>
                </Popover.Trigger>
                <Popover.Content width="200px"
                  className={`flex flex-col gap-2 ${isDark ? "!bg-black" : ""}`}>
                  <Button variant="solid">
                    My List
                  </Button>
                  <Button variant="solid">
                    Profile
                  </Button>
                  <Button
                    onClick={logout}
                    variant="solid"
                    color="red">
                    Logout
                  </Button>

                </Popover.Content>
              </Popover.Root>
          ) : (
            <Link to="login">
              <Button variant="solid" size="3" className="!w-32 bg-blue-500 text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
