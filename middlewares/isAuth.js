import Users from "../models/users.js"
import jwt from "jsonwebtoken"


const tokenBlacklist = new Set();
export const isAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
        const token = req.headers.authorization.split(' ')[1];
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ error: 'Token revoked. Please log in again.' });
        }
        const decodedToken = jwt.verify(token, process.env.KEY);
        const findUser = await Users.findById(decodedToken.userId)
        req.user = findUser
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export const logout = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
        const token = req.headers.authorization.split(' ')[1];

        tokenBlacklist.add(token);
        console.log(tokenBlacklist);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Authorization middleware
export const userRole = (requiredRole) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.KEY);
        console.log(decodedToken);
        const findUser = await Users.findById(decodedToken.userId)
        console.log("#######################",findUser);
        req.user = findUser
        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (findUser.role !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    } catch (error) {
        console.error('Error authorizing user:', error);
        res.status(500).json({ error: 'An error occurred while authorizing the user' });
    }
}