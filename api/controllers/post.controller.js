import Post from "../models/post.model.js";
import PermissionRequest from "../models/permissionRequest.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

const SUPER_ADMIN_ID = "677aa3c758cef46378eb42ab";

export const create = async (req, res, next) => {
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all required fields"))
    }
    const slug = req.body.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")  // Remove all special characters except hyphens and spaces
        .replace(/\s+/g, "-")          // Replace spaces with a single hyphen
        .replace(/-+/g, "-")           // Replace multiple hyphens with a single hyphen
        .replace(/^-|-$/g, "");        // Remove leading and trailing hyphens

    const newPost = new Post({
        ...req.body, slug, userId: req.user.id
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error)
    }
}


export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    { content: { $regex: req.query.searchTerm, $options: "i" } },
                ]
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });

    } catch (error) {
        next(error)
    }
}

export const deletePost = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "You do not have permission to delete this post")
        );
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Post deleted successfully")
    } catch (error) {
        next(error)
    }
}

export const updatePost = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "You do not have permission to update this post")
        );
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image
            }
        }, { new: true });
        res.status(200).json(updatedPost)
    } catch (error) {
        next(error)
    }
}

// Download posts with permission check
export const downloadPosts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isSuperAdmin = userId === SUPER_ADMIN_ID;

        const user = await User.findById(userId);
        if (!user || (!user.isAdmin && !isSuperAdmin)) {
            return next(errorHandler(403, "Only admins and super admins can download posts"));
        }

        let maxRecords = null;

        if (!isSuperAdmin) {
            const revokedRequest = await PermissionRequest.findOne({
                requesterId: userId,
                requestType: "download_all_posts",
                status: "revoked",
            }).sort({ approvedAt: -1 });

            if (revokedRequest) {
                const newerApprovedRequest = await PermissionRequest.findOne({
                    requesterId: userId,
                    requestType: "download_all_posts",
                    status: "approved",
                    approvedAt: { $gt: revokedRequest.approvedAt },
                });

                if (!newerApprovedRequest) {
                    maxRecords = 9;
                } else {
                    maxRecords = null;
                }
            } else {
                const approvedRequest = await PermissionRequest.findOne({
                    requesterId: userId,
                    requestType: "download_all_posts",
                    status: "approved",
                });

                if (!approvedRequest) {
                    maxRecords = 9;
                } else {
                    maxRecords = null;
                }
            }
        }

        const query = {};
        if (req.query.userId) {
            query.userId = req.query.userId;
        }

        const posts = maxRecords
            ? await Post.find(query).sort({ updatedAt: -1 }).limit(maxRecords)
            : await Post.find(query).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            posts,
            totalRecords: posts.length,
            maxRecords: maxRecords || "unlimited",
        });
    } catch (error) {
        next(error);
    }
}