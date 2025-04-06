import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import User from '../models/user.models.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

export default router;
