/**
 * @module Like
 * @description Defines the schema for like and exports the Like model.
 */

import mongoose from "mongoose";

/**
 * Represents a like schema.
 * @typedef {Object} LikeSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the like.
 * @property {mongoose.Schema.Types.Mixed} target - The target associated with the like. It can be a post or a comment.
 */
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false
    }
}, { timestamps: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;