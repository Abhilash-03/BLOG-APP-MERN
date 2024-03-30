import  express from "express";
import { updateUser, deleteUser, logout, getUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.patch('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/logout', logout)
router.get('/getusers', verifyToken, getUsers);

export default router;