import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password || username === "" || email === "" || password === "") {
            // return res.status(400).json({ message: "Please fill all the fields" });
            next(errorHandler(400, "All fields are required"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()
        return res.status(200).json("User created successfully");
    } catch (error) {
        // res.status(500).json({ message: error.message })
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
        return next(errorHandler(400, "All fields are required"))
    }

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            next(errorHandler(404, "User not found"))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(401, "Invalid password"));
        }

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        const loggedInUser = await User.findById(validUser._id).select("-password")

        res.status(200)
            .cookie("access_token", token, {
                httpOnly: true,
                secure: true
            })
            .json(loggedInUser)

    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200)
                .cookie("access_token", token, {
                    httpOnly: true,
                    secure: true
                })
                .json(rest)
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200)
                .cookie("access_token", token, {
                    httpOnly: true,
                    secure: true
                })
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}