import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import Like from "../models/likeModel.js";

/**
 * @class
 * @classdesc The controller for handling comments methods.
 * @method create
 * @method getAll
 */
class CommentController {
    static async create(req, res) {
        const id = req.user._id;
        const { postId, body, images } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to create a comment." });
        if(!postId) return res.status(400).json({ message: "postId is required to create a comment." });
        if(!body && !images) return res.status(400).json({ message: "body or images are required to create a comment." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const comment = new Comment({ user: id, post: postId, body, images });
            await comment.save();

            return res.status(201).json({ message: "Comment created successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getAll(req, res) {
        const id = req.user._id;
        const { postId } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to get all comments." });
        if(!postId) return res.status(400).json({ message: "postId is required to get all comments." });

        try {
            const comments = await Comment.find({ post: postId });
            if (!comments) return res.status(404).json({ message: "Comments not found." });

            const formattedComments = await Promise.all(comments.map(async (comment) => {
                const commentUser = await User.findById(comment.user);
                const commentLike = await Like.findOne({ user: id, target: comment._id });

                return {
                    _id: comment._id,
                    user: {
                        _id: commentUser._id,
                        name: commentUser.name,
                        email: commentUser.email,
                    },
                    body: comment.body,
                    images: comment.images,
                    liked: commentLike === null ? false : true,
                    createdAt: comment.createdAt,
                }
            }))

            return res.status(200).json({ formattedComments });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default CommentController;