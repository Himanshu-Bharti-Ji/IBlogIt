import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px]">
      <Link to={`/post/${post?.slug}`}>
        <img
          src={post?.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-10"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post?.title}</p>
        <span className="text-sm italic">{post?.category}</span>
        <Link
          to={`/post/${post?.slug}`}
          className="z-10 group-hover:bottom-1 absolute bottom-[-200px] left-1 right-1 border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md"
        >
          Read article
        </Link>
      </div>
    </div>
  );
};

export default PostCard;