import { Alert, Textarea, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyButton from "./MyButton";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: currentUser?._id,
          content: comment,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

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
        <>
          <form
            className="border border-teal-500 rounded-md p-3"
            onSubmit={handleSubmit}
          >
            <Textarea
              rows={3}
              maxLength={"200"}
              placeholder="Add a comment..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-500 text-sm">
                {200 - comment.length} characters remaining
              </p>
              <MyButton outline type="submit">
                Submit
              </MyButton>
            </div>
          </form>
          {commentError && (
            <Alert color={"failure"} className="mt-5">
              {commentError}
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
