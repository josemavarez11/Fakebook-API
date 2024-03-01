/**
 * @module Friend
 * @description Defines the schema for friend and exports the Friend model.
 */

import mongoose from "mongoose";

/**
 * Represents a friend schema.
 * @typedef {Object} FriendSchema
 * @property {mongoose.Schema.Types.ObjectId} applicant - User that sent the friend request.
 * @property {mongoose.Schema.Types.ObjectId} requested - User that received the friend request.
 * @property {boolean} accepted - True if the friend request is accepted, false otherwise.
 * @property {Date} createdAt - The date and time when the note was created.
 * @property {Date} updatedAt - The date and time when the note was last updated.
 */
const friendSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false,
        default: null
    },
    requested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false,
        default: null
    },
    accepted: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;