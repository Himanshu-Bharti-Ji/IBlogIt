import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return next(errorHandler(403,
                "You do not have permission to create a comment on this post."
            ))
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        });

        await newComment.save();

        res.status(201).json(newComment);

    } catch (error) {
        next(error)
    }
}