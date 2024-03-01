import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

/**
 * Middleware function to authenticate requests using JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const tokenValue = token.split(' ')[1];

    try {
        const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        console.log(`Token verified for user ${user.name}.`);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export default authenticate;