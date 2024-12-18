import { Button } from "flowbite-react";
import React from "react";

const MyButton = ({
  children,
  type = "button",
  outline = false,
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <div>
      <Button
        type={type}
        outline={outline}
        disabled={disabled}
        onClick={onClick}
        className={`w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg text-center ${className}`}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default MyButton;
