import { Textarea, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyButton from "./MyButton";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {!currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>signed in as:</p>
          <img
            className="h-6 w-6 object-cover rounded-full"
            src={currentUser?.profilePicture}
            alt={currentUser?.username}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser?.username}
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2 my-5 text-gray-500 text-sm">
          <p>You must be Signed in to comment.</p>
          <Link className="text-cyan-600 hover:underline" to={"/sign-in"}>
            SignIn
          </Link>
        </div>
      )}
      {currentUser && (
        <form>
          <Textarea rows={3} maxLength={"200"} placeholder="Add a comment..." />
          <div className="">
            <p>200 characters remaining</p>
            <MyButton outline type="submit">
              Submit
            </MyButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
