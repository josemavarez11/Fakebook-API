import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Favorite from '../models/favoriteModel.js';
import Friend from '../models/friendModel.js';
import Like from '../models/likeModel.js';

/**
 * @class
 * @classdesc The controller for handling posts methods.
 * @method create
 * @method updateBody
 * @method updateImages
 * @method delete
 * @method getFavorites
 * @method getByFriends
 * @method getAll
 */
class PostController {
    static async create(req, res) {
        const id = req.user._id;
        const { body, images } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to create a post." });
        if(!body || !images) return res.status(400).json({ message: "Body and images are required to create a post." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const post = new Post({ user: id, body, images });
            await post.save();

            return res.status(201).json({ message: "Post created successfully." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateBody(req, res) {
        const id = req.user._id;
        const { postId, newBody } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to update a post's body." });
        if(!postId) return res.status(400).json({ message: "Post id is required to update a post's body." });
        if(!newBody) return res.status(400).json({ message: "New body is required to update a post's body." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ message: "Post not found." });

            if(post.body === newBody) return res.status(400).json({ message: "New body cannot be the same as the old body. No changes made." });

            post.body = newBody;
            await post.save();

            res.status(200).json({ message: "Post body updated successfully." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateImages(req, res) {
        const id = req.user._id;
        const { postId, newImages } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to update a post's images." });
        if(!postId) return res.status(400).json({ message: "Post id is required to update a post's images." });
        if(!newImages) return res.status(400).json({ message: "New images are required to update a post's images." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ message: "Post not found." });

            if(post.images === newImages) return res.status(400).json({ message: "New images cannot be the same as the old images. No changes made." });

            post.images = newImages;
            await post.save();

            res.status(200).json({ message: "Post images updated successfully." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        const id = req.user._id;
        const { postId } = req.params;

        if(!id) return res.status(400).json({ message: "Id is required to delete a post." });
        if(!postId) return res.status(400).json({ message: "Post id is required to delete a post." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const post = await Post.findOne({ _id: postId, user: id });
            if (!post) return res.status(404).json({ message: "Post not found." });

            post.deleted = true;
            await post.save();

            res.status(200).json({ message: "Post deleted successfully." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getFavorites(req, res) {
        const id = req.user._id;

        if(!id) return res.status(400).json({ message: "Id is required to get favorite posts." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const favorites = await Favorite.find({ user: id });

            const formattedFavorites = await Promise.all(favorites.map(async post => {
                const postDetails = await Post.findById(post.post, { deleted: false });
                const postUser = await User.findById(postDetails.user);
                const postLike = await Like.findOne({ user: id, target: postDetails._id });

                const formattedUser = { _id: postUser._id, name: postUser.name };

                return {
                    _id: postDetails._id,
                    user: formattedUser,
                    body: postDetails.body,
                    images: postDetails.images,
                    liked: postLike === null ? false : true,
                    createdAt: postDetails.createdAt,
                    updatedAt: postDetails.updatedAt
                }
            }));

            res.status(200).json({ posts: formattedFavorites });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByFriends(req, res) { // potential bug here
        const id = req.user._id;

        if(!id) return res.status(400).json({ message: "Id is required to get posts by friends." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const friendships = await Friend.find({
                $or: [{ applicant: id }, { requested: id }],
                accepted: true
            });

            const friendsIds = friendships.map(friendship => {
                return friendship.applicant === id ? friendship.applicant : friendship.requested;
                //potential bug here.
            });

            const friendsPosts = await Post.find({ user: { $in: friendsIds }, deleted: false })
                .populate('user', 'deleted')
                .exec();

            const filteredFriendsPosts = friendsPosts.filter(post => !post.user.deleted);

            const formattedPosts = await Promise.all(filteredFriendsPosts.map(async post => {
                const postUser = await User.findById(post.user);
                const postFavorite = await Favorite.findOne({ user: id, post: post._id });
                const postLike = await Like.findOne({ user: id, target: post._id });

                console.log(postLike);

                return {
                    _id: post._id,
                    user: {
                        _id: postUser._id,
                        name: postUser.name,
                    }, 
                    body: post.body,
                    images: post.images,
                    liked: postLike === null ? false : true,
                    favorite: postFavorite === null ? false : true,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt
                }
            }));
            
            res.status(200).json({ posts: formattedPosts });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAll(req, res) {
        const id = req.user._id;

        if(!id) return res.status(400).json({ message: "Id is required to get all posts." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const posts = await Post.find({ user: id, deleted: false });

            const formattedPosts = posts.map(post => {
                return {
                    _id: post._id,
                    body: post.body,
                    images: post.images,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt
                }
            });

            res.status(200).json({ posts: formattedPosts });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default PostController;