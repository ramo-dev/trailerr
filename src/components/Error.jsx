import React from "react";
import ErrorImg from "../assets/error.jpg"

export default function ErrorBoundary() {
  return (
    <img src={ErrorImg}
      style={{ filter: "revert" }}
      className="md:max-w-[500px] md:mx-auto w-full md:min-h-1/2"
    />
  )
}
