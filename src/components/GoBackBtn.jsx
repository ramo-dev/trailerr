
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"

export default function GoBackBtn() {


  return (
    <Link to={-1} className={`fixed md:top-[13.5%] top-[13%] md:left-3 left-3 z-[99]`}>
      <button className="p-2 rounded-full bg-blue-500 border-2 border-gray-300 w-max cursor-pointer">
        <ChevronLeft className="cursor-pointer text-white" />
      </button>
    </Link>
  );
}
