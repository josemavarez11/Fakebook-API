/**
 * @module Comment
 * @description Defines the schema for comment and exports the Comment model.
 */

import mongoose from "mongoose";

/**
 * Represents a comment schema.
 * @typedef {Object} PostSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the comment.
 * @property {mongoose.Schema.Types.ObjectId} post - The post associated with the comment.
 * @property {string} body - The body of the comment.
 * @property {Array} images - The images of the comment.
 */
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        unique: false
    },
    body: {
        type: String,
        required: false,
        unique: false
    },
    images: {
        type: Array,
        required: false,
        unique: false,
        default: []
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;