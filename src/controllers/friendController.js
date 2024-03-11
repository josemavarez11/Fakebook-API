import User from '../models/userModel.js';
import Friend from '../models/friendModel.js';

/**
 * @class
 * @classdesc The controller for handling friends methods.
 * @method sendRequest
 * @method answerRequest
 */
class FriendController {
    static async sendRequest(req, res) {
        const id = req.user._id;
        const { requested } = req.body; //user requested id

        if(!id) return res.status(400).json({ message: "Id is required to send a friend request." });
        if(!requested) return res.status(400).json({ message: "Requested user is required to send a friend request." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const requestedUser = await User.findById(requested);
            if (!requestedUser) return res.status(404).json({ message: "Requested user not found." });

            const friendRequest = new Friend({ applicant: id, requested: requestedUser._id });
            await friendRequest.save();

            return res.status(200).json({ message: "Friend request already sent." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async answerRequest(req, res) {
        const id = req.user._id;
        const { applicant, answer } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to answer a friend request." });
        if(!applicant) return res.status(400).json({ message: "Applicant is required to answer a friend request." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const friendRequest = await Friend.findOne({ applicant, requested: id });
            if (!friendRequest) return res.status(404).json({ message: "Friend request not found." });

            if (answer === false) {
                await friendRequest.deleteOne();
                return res.status(200).json({ message: "Friend request declined successfully." });
            }
            
            friendRequest.accepted = true;
            await friendRequest.save();

            return res.status(200).json({ message: "Friend request accepted successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getRequests(req, res) {
        const id = req.user._id;

        if(!id) return res.status(400).json({ message: "Id is required to get friend requests." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const friendRequests = await Friend.find({ requested: id, accepted: false });
            if (!friendRequests) return res.status(200).json({ message: "No friend requests found" });

            const formattedFriendRequests = await Promise.all(friendRequests.map(async friendRequest => {
                const applicant = await User.findById(friendRequest.applicant);

                return {
                    _id: friendRequest._id,
                    applicant: {
                        _id: applicant._id,
                        name: applicant.name,
                        email: applicant.email
                    },
                    accepted: friendRequest.accepted
                };
            }));

            return res.status(200).json(formattedFriendRequests);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async deleteFriendship(req, res) {
        const id = req.user._id;
        const { friend } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to delete a friend." });
        if(!friend) return res.status(400).json({ message: "Friend id is required to delete a friend." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const friendship = await Friend.findOne({ $or: [{ applicant: id, requested: friend }, { applicant: friend, requested: id }], accepted: true });
            if (!friendship) return res.status(404).json({ message: "Friendship not found." });

            await friendship.delete();

            return res.status(200).json({ message: "Friendship deleted successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async existFriendship(req, res) {
        const id = req.user._id;
        const { friend } = req.params;

        if(!id) return res.status(400).json({ message: "Id is required to check if a friendship exists." });
        if(!friend) return res.status(400).json({ message: "Friend id is required to check if a friendship exists." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const friendship = await Friend.findOne({ $or: [{ applicant: id, requested: friend }, { applicant: friend, requested: id }], accepted: true });
            if (!friendship) return res.status(200).send(false);

            return res.status(200).send(true);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default FriendController;