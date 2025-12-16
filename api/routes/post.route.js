import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, deletePost, getPosts, updatePost, downloadPosts } from "../controllers/post.controller.js";

const router = express.Router();


router.post("/create", verifyToken, create)
router.get("/get-posts", getPosts)
router.get("/download-posts", verifyToken, downloadPosts)
router.delete("/delete-post/:postId/:userId", verifyToken, deletePost)
router.put("/update-post/:postId/:userId", verifyToken, updatePost)


export default router;