import express from 'express';
import userController from '../controllers/user.controller.js';
import authValidation from '../middlewares/auth.js';

const router = express.Router();

router.patch('/api/infos', authValidation, userController.updateInfo);
router.patch('/api/password', authValidation, userController.updatePassword);
router.get('/api/infos', authValidation, userController.getUserInfo);

export default router;