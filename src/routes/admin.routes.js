

import express from 'express';
const router = express.Router();
import {varifyJwt} from '../middlewares/auth.middleware.js';
import {authorizeAdmin} from '../middlewares/authorizeAdmin.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

import {registerAdmin, getAllUsers, updateUserDeatailsByAdmin, deleteUserAccountByAdmin} from '../controllers/admin.controller.js';


router.post('/register', upload.single('profileImage'), registerAdmin);
router.get('/users', varifyJwt, authorizeAdmin, getAllUsers);
router.put('/users/:userId', varifyJwt, authorizeAdmin, upload.single('profileImage'), updateUserDeatailsByAdmin);
router.delete('/users/:userId', varifyJwt, authorizeAdmin, deleteUserAccountByAdmin);



export default router;