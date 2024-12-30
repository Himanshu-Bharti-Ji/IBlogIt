import React from "react";
import CallToAction from "../components/CallToAction";

export default function Projects() {
  return (
    <div className="min-h-screen p-3 max-w-4xl mx-auto flex flex-col justify-center items-center gap-6 text-center">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="text-gray-500 text-lg">
        Dive into some of the most exciting projects I’ve worked on! Each one
        showcases my dedication to creating user-centric designs and efficient
        solutions, reflecting my journey as a passionate frontend developer.
        Explore my portfolio to see more of my work and the technologies I
        specialize in.
      </p>

      <CallToAction />
    </div>
  );
}
