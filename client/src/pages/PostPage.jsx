import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        if (res.ok) {
          setPost(data?.posts[0]);
          setError(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const res = await fetch("/api/post/get-posts?limit=3");
        const data = await res.json();
        if (res.ok) {
          setRecentPost(data?.posts);
        }
      };
      fetchRecentPost();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <>
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post && post?.title}
        </h1>
        {post?.category && (
          <Link
            to={`/search/category=${post?.category}`}
            className="self-center mt-5"
          >
            <Button color={"gray"} pill size={"sm"}>
              {post?.category}
            </Button>
          </Link>
        )}
        <img
          src={post?.image}
          alt={post?.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
          <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {(post?.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
        <div className="max-w-4xl mx-auto w-full">
          <CallToAction />
        </div>
        <CommentSection postId={post?._id} />
      </main>
      <div className="p-3 flex flex-col max-w-8xl mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center mb-5 ">
          <h1 className="text-xl mt-5">Recent articles</h1>
          <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {recentPost &&
              recentPost?.map((post) => (
                <PostCard key={post?._id} post={post} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
