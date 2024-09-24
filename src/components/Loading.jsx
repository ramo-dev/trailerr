import React from "react";
import useThemeStore from "../store/ThemeStore";


export default function Loader() {

  const { isDark } = useThemeStore();

  return (
    <div className={`h-screen grid place-items-center ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="flex flex-row gap-2 mx-auto">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
      </div>

    </div>
  )
}
