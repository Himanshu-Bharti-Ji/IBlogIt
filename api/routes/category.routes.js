import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
    createCategory,
    deleteCategory,
    editCategory,
    getCategories,
    getCategoryById,
} from "../controllers/category.controller.js";

const router = express.Router();

// Create a new category
router.post("/create", verifyToken, createCategory);

// Get all categories
router.get("/get-categories", getCategories);

// Get a single category by ID
router.get("/getCategoryById/:categoryId", getCategoryById);

// Edit an existing category
router.put("/editCategory/:categoryId", verifyToken, editCategory);

// Delete a category
router.delete("/deleteCategory/:categoryId", verifyToken, deleteCategory);

export default router;
