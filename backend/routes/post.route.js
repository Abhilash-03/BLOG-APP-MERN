import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getPosts, deletePost, updatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getPosts', getPosts);
router.delete('/deletePost/:postId/:userId', verifyToken, deletePost);
router.patch('/updatePost/:postId/:userId', verifyToken, updatePost);


export default router;