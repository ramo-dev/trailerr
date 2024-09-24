import { Button } from "@radix-ui/themes";

import Search from "./Search";
import { Link } from "react-router-dom";
import { FilmIcon, Moon } from "lucide-react";

export default function Navbar() {


  return (
    <nav className="border-b p-4 bg-white sticky top-0 z-10 md:px-10">
      <div className=" mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold">
          <FilmIcon className="h-8 w-8" />
          <p className="sr-only">WatchWise</p>
        </Link>
        <div className="ms-auto me-8">
          <Search />
        </div>
        <div className="flex space-x-4">
          <button variant="outline" size="3" className="rounded-full border-2 p-2 text-blue-500 hover:border-blue-500">
            <Moon />
          </button>
          <Button variant="solid" size="3" className="w-32 bg-blue-500 text-white">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
