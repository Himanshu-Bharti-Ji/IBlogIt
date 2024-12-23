import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs"

export const test = (req, res) => {
    res.json({ message: "Api is working" });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You can't update this user"));
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    if (req.body.username) {
        if (req.body.username.length < 4 || req.body.username.length > 20) {
            return next(errorHandler(400, "Username must be between 7 and 20 characters"))
        }

        if (req.body.username.includes(" ")) {
            return next(errorHandler(
                400, "Username can't contain spaces"
            ))
        }

        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(
                400, "Username must be in lowercase"
            ))
        }

        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(
                400, "Username can only contain letters and numbers"
            ))
        }
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            },
        }, { new: true })
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this user"))
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

export const signout = async (_, res, next) => {
    try {
        res.clearCookie("access_token")
            .status(200)
            .json("User has been signed out");
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        const users = await User.find().sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit).select("-password");

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            users,
            totalUsers,
            lastMonthUsers
        });

    } catch (error) {
        next(error)
    }
}

export const getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");

        if (!user) {
            return next(errorHandler(404, "User not found"))
        }

        res.status(200).json(user);

    } catch (error) {
        next(error)
    }
}