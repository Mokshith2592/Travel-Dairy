import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { getUsers, signout } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/getusers' ,verifyToken ,getUsers)
router.post('/signout' ,signout);

export default router