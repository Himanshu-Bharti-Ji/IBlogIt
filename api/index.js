import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB Connection failed", err);
    })

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

app.use("/api/user", userRoutes)