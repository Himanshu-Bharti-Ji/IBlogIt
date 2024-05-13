import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/errorHandler.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password || username === "" || email === "" || password === "") {
            return res.status(400).json({ message: "Please fill all the fields" });
            // next(errorHandler(400, "All fields are required"));
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
        res.status(500).json({ message: error.message })
        // next(error);
    }
}