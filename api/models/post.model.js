import mongoose from "mongoose";

// Declare the Schema of the User model
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/11/06/13/25/blog-1027861_1280.jpg"
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

//Export the model
const Post = mongoose.model("Post", postSchema);

export default Post;