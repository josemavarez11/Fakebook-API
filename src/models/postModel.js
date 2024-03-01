/**
 * @module Post
 * @description Defines the schema for post and exports the Post model.
 */

import mongoose from "mongoose";

/**
 * Represents a post schema.
 * @typedef {Object} PostSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the post.
 * @property {string} body - The body of the post.
 * @property {Array} images - The images of the post.
 * @property {boolean} deleted - True if the post is deleted, false otherwise.
 */
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    },
    deleted: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;