import User from "../models/userModel.js";
import Like from "../models/likeModel.js";

/**
 * @class
 * @classdesc The controller for handling like methods.
 * @method like
 * @method dislike
 */
class LikeController {
    static async like(req, res) {
        const id = req.user._id;
        const { targetId } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to like a post or comment." });
        if(!targetId) return res.status(400).json({ message: "targetId is required to like a post or comment." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const like = new Like({ user: id, target: targetId });
            await like.save();

            return res.status(201).json({ message: "Like created successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async dislike(req, res) {
        const id = req.user._id;
        const { targetId } = req.body;

                if(!id) return res.status(400).json({ message: "Id is required to dislike a post or comment." });
                if(!targetId) return res.status(400).json({ message: "targetId is required to dislike a post or comment." });

                try {
                    const user = await User.findById(id);
                    if (!user) return res.status(404).json({ message: "User not found." });

                    const like = await Like.findOneAndDelete({ user: id, target: targetId });
                    if (!like) return res.status(404).json({ message: "Like not found." });

                    return res.status(200).json({ message: "Like removed successfully." });
                } catch (error) {
                    return res.status(500).json({ message: error.message });
                }
    }
}

export default LikeController;