import { Alert, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MyButton from "./MyButton";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const navigate = useNavigate();

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
        setCommentData([data, ...commentData]);
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setCommentData(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setCommentData(
          commentData?.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setCommentData(
      commentData?.map((c) =>
        c._id === comment._id
          ? {
              ...c,
              content: editedContent,
            }
          : c
      )
    );
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
      {commentData.length === 0 ? (
        <p className="text-sm my-5">No commnets yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-2">
            <p>Comments</p>
            <div className="border border-gray-400 px-2 rounded-sm">
              <p>{commentData.length}</p>
            </div>
          </div>
          {commentData?.map((comment) => (
            <Comment
              key={comment?._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
