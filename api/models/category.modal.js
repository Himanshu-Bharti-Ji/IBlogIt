import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 50,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

categorySchema.index({ title: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
