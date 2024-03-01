import Favorite from "../models/favoriteModel.js";
import User from "../models/userModel.js";

/**
 * @class
 * @classdesc The controller for handling favorites methods.
 * @method add
 * @method remove
 */
class FavoriteController {
    static async add(req, res) {
        const id = req.user._id;
        const { postId } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to add a post to favorites." });
        if(!postId) return res.status(400).json({ message: "postId is required to add a post to favorites." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const favorite = new Favorite({ user: id, post: postId });
            await favorite.save();

            return res.status(201).json({ message: "Post added to favorites successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async remove(req, res) {
        const id = req.user._id;
        const { postId } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to remove a post from favorites." });
        if(!postId) return res.status(400).json({ message: "postId is required to remove a post from favorites." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const favorite = await Favorite.findOneAndDelete({ user: id, post: postId });
            if (!favorite) return res.status(404).json({ message: "Favorite not found." });

            return res.status(200).json({ message: "Post removed from favorites successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default FavoriteController;