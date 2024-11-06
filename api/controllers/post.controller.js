import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js"

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