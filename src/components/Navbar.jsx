import { Button } from "@radix-ui/themes";

import Search from "./Search";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";

export default function Navbar() {


  return (
    <nav className="border-b p-4 bg-white sticky top-0 z-10 md:px-10">
      <div className=" mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold">
          <Book className="h-8 w-8" />
          <p className="sr-only">Newslify</p>
        </Link>
        <div className="ms-auto me-8">
          <Search />
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" size="3" className="text-blue-500 border-blue-500">
            Login
          </Button>
          <Button variant="solid" size="3" className="bg-blue-500 text-white">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
