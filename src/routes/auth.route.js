import express from 'express';
import authController from '../controllers/auth.controller.js';
import authValidation from '../middlewares/auth.js';

const router = express.Router();

router.post('/api/login', authController.login);
router.get('/api/login', authValidation, authController.loginChk);
router.get('/api/logout', authController.logout);
router.post('/api/register', authController.register);
router.get('/api/register/id/:userid', authController.idDupChk);
router.get('/api/register/name/:nickname', authController.nicknameDupChk);

export default router;