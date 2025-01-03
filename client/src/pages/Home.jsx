import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/post/get-posts?limit=6`);
      const data = await res.json();

      if (res.ok) {
        setPosts(data?.posts);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to IBlogIt</h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          <p className="">
            Discover a platform where creativity meets storytelling. Share your
            thoughts, explore new ideas, and connect with a community of
            like-minded individuals. iBlogIt is your personal space to blog,
            inspire, and be inspired.
          </p>
          <p className="mt-4">
            Ready to start your blogging journey? Dive in and let your voice be
            heard!
          </p>
        </div>
        <Link
          to={"/search"}
          className="w-fit text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="max-w-6xl mx-auto p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl sm:max-w-[80%] mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-5 justify-center">
              {posts?.map((post) => (
                <PostCard key={post?._id} post={post} />
              ))}
            </div>
          </div>
        )}
        <Link
          to={"/search"}
          className="w-fit mx-auto text-lg text-teal-500 hover:underline text-center"
        >
          View all Posts
        </Link>
      </div>
    </div>
  );
}
