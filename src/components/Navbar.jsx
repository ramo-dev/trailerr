import { Button } from "@radix-ui/themes";

import Search from "./Search";
import { Link } from "react-router-dom";
import { FilmIcon, Moon, Sun } from "lucide-react";
import useThemeStore from "../store/ThemeStore";

export default function Navbar() {

  const { isDark, toggleTheme } = useThemeStore();



  return (
    <nav className={`${isDark ? "bg-black" : "bg-white border-b"} p-4 sticky top-0 z-10 md:px-10`}>
      <div className=" mx-auto flex justify-between items-center">
        <Link to="/" className={`${isDark ? "text-white" : "text-black"} text-2xl font-semibold`}>
          <FilmIcon className="h-8 w-8" />
          <p className="sr-only">WatchWise</p>
        </Link>
        <div className="ms-auto me-8">
          <Search />
        </div>
        <div className="flex space-x-4">
          <button onClick={toggleTheme} variant="outline" size="3" className="rounded-full border-2 p-2 text-blue-500 border-blue-500">
            {isDark ? <Sun /> : <Moon />}
          </button>
          <Button variant="solid" size="3" className="w-32 bg-blue-500 text-white">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
