/**
 * Middleware function that logs the received request information.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const reqReceivedMiddleware = (req, res, next) => {
    console.log(`${req.method} RECEIVED ${req.protocol}:/${req.url}`);
    next();
}

export default reqReceivedMiddleware;