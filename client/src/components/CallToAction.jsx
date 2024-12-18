import { Button } from "flowbite-react";
import React from "react";
import MyButton from "./MyButton";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">Curious About Me?</h2>
        <p className="text-gray-500 my-2">
          Explore my work and skills in my portfolio.
        </p>
        <MyButton className="rounded-tl-xl rounded-bl-none">
          <a
            href="https://himanshubharti.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Portfolio
          </a>
        </MyButton>
      </div>
      <div className="p-7 flex-1 ">
        <img src="https://himanshubharti.netlify.app/assets/heroImg-DsAQzIXj.png" />
      </div>
    </div>
  );
};

export default CallToAction;
