
import { ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function showOnScroll() {
      if (window.scrollY > 10) {
        setShow(true);
      } else {
        setShow(false);
      }
    }

    window.addEventListener("scroll", showOnScroll);

    return () => window.removeEventListener("scroll", showOnScroll);
  }, []);

  return (
    <a href="#" className={`fixed md:bottom-10 bottom-8 md:right-10 right-5 ${show ? "" : "hidden"}`}>
      <button className="p-3 rounded-full bg-blue-500 border-2 border-gray-300 w-max cursor-pointer">
        <ArrowUp className="cursor-pointer text-white" />
      </button>
    </a>
  );
}
