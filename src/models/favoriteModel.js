/**
 * @module Favorite
 * @description Defines the schema for favorite and exports the Favorite model.
 */

import mongoose from "mongoose";

/**
 * Represents a favorite schema.
 * @typedef {Object} FavoriteSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the favorite.
 * @property {mongoose.Schema.Types.ObjectId} post - The post associated with the favorite.
 */
const favoriteSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;