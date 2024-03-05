import User from "../models/userModel.js";
import Friend from "../models/friendModel.js";

/**
 * @class
 * @classdesc The controller for handling user methods.
 * @method delete
 * @method updatePassword
 * @method updateEmail
 * @method updateName
 */
class UserController {
    static async delete(req, res) {
        const id = req.user._id;

        if(!id) return res.status(400).json({ message: "Id is required to delete a user." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const friends = await Friend.find({ $or: [{ requester: id }, { recipient: id }] });

            user.deleted = true;
            friends.forEach(async friend => await friend.remove())

            await user.save();
            res.status(200).json(`${user.email}'s was deleted successfully.`);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updatePassword(req, res) {
        const id = req.user._id;
        const { newPassword } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to update a user's password." });
        if(!newPassword) return res.status(400).json({ message: "New password is required to update a user's password." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });
    
            const passwordMatch = await user.comparePassword(newPassword);
            if(passwordMatch) return res.status(400).json({ message: "New password cannot be the same as the old password." });
    
            user.password = newPassword;
            await user.save();

            res.status(200).json(`${user.email}'s password updated successfully.`);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateEmail(req, res) {
        const id = req.user._id;
        const { newEmail } = req.body;
    
        if(!id) return res.status(400).json({ message: "Id is required to update a user's email." });
        if(!newEmail) return res.status(400).json({ message: "New email is required to update a user's email." });
    
        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });
    
            const emailMatch = await user.compareEmail(newEmail);
            if(emailMatch) return res.status(400).json({ message: "New email is the same as the old email. No changes made." });
    
            user.email = newEmail;
            await user.save();

            res.status(200).json(`User ${user.email}'s email updated successfully.`);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateName(req, res) {
        const id = req.user._id;
        const { newName } = req.body;
    
        if(!id) return res.status(400).json({ message: "Id is required to update a user's name." });
        if(!newName) return res.status(400).json({ message: "New name is required to update a user's name." });
    
        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });
    
            const nameMatch = await user.compareName(newName);
            if(nameMatch) return res.status(400).json({ message: "New name is the same as the old name. No changes made." });
    
            user.name = newName;
            await user.save();

            res.status(200).json(`${user.email}'s name updated successfully.`);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async search(req, res) {
        const id = req.user._id;
        const { name } = req.body;

        if(!id) return res.status(400).json({ message: "Id is required to search for a user." });
        if(!name) return res.status(400).json({ message: "Name is required to search for a user." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const users = await User.find({ 
                _id: { $ne: req.user._id },
                name: { $regex: new RegExp(name), $options: "i" },
                deleted: false
            });

            if (!users) return res.status(200).json({ message: "No users found" });

            const formattedUsers = users.map(user => {
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

            return res.status(200).json(formattedUsers);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getNameAndEmail(req, res) {
        const id = req.user._id;

        if(!id) return res.status(400).json({ message: "Id is required to get a user's name and email." });

        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            res.status(200).json({
                name: user.name,
                email: user.email
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });    
        }
    }
}

export default UserController;