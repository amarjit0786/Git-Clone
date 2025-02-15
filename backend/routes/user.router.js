import express from 'express';
const userRouter = express.Router();
import {
    getAllUsers,
    signUp,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
} from '../controllers/userController.js';

userRouter.get('/allUsers', getAllUsers);
userRouter.post('/signUp', signUp);
userRouter.post('/login', login);
userRouter.get('/userProfile/:id', getUserProfile);
userRouter.put('/updateUserProfile/:id', updateUserProfile);
userRouter.delete('/deleteUserProfile/:id', deleteUserProfile);

export default userRouter;
