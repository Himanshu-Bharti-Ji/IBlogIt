import Category from "../models/category.modal.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createCategory = async (req, res, next) => {

    try {
        const { title, description } = req.body;

        if (!req.user.isAdmin) {
            return next(errorHandler(403, "You do not have permission to create a category."));
        }

        const newCategory = new Category({
            title,
            description,
        });

        await newCategory.save();

        res.status(201).json(newCategory);

    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = req.query.limit === 'none' ? 0 : parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const categories = await Category.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);


        const totalCategory = await Category.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthCategory = await Category.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            categories,
            totalCategory,
            lastMonthCategory
        });

    } catch (error) {
        next(error)
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return next(errorHandler(404, "Category not found"));
        }

        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

export const editCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return next(errorHandler(404, "Category not found"));
        }

        if (!req.user.isAdmin) {
            return next(errorHandler(403, "You are not allowed to edit this category"));
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.categoryId,
            {
                title: req.body.title,
                description: req.body.description,
            },
            { new: true }
        );

        res.status(200).json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return next(errorHandler(404, "Category not found"));
        }

        if (!req.user.isAdmin) {
            return next(errorHandler(403, "You are not allowed to delete this category"));
        }

        await Category.findByIdAndDelete(req.params.categoryId);

        res.status(200).json("Category deleted successfully");
    } catch (error) {
        next(error);
    }
};

