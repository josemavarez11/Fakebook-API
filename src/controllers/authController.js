import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

/**
 * @class
 * @classdesc The controller for handling user authentication.
 * @method register
 * @method login
 * @method logout
 */
class AuthController {
    static async register(req, res) {
        const { name, email, password } = req.body;

        try {
            let userExists = await User.find({ email: email });
            if (userExists.length > 0) return res.status(400).json({ message: 'User already exists.' });

            const user = new User({ name, email, password });
            await user.save();

            console.log(`New user created: ${user}.`);
            res.status(201).json({ message: "User created successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email, deleted: false });
            if (!user) return res.status(404).json({ message: 'User not found.' });

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return res.status(401).json({ message: 'Incorrect password.' });

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            console.log(`${user.email} has logged in.`);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;
