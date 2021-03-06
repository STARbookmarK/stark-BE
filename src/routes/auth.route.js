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

/**
 * @swagger
 * tags:
 *  name: auth
 *  description: 로그인/로그아웃/회원가입
 */

/**
 * @swagger
 * /api/login:
 *  post:
 *    summary: 로그인
 *    tags: [auth]
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *            - id
 *            - pw
 *            - autoLogin
 *          properties:
 *            id:
 *              type: string
 *            pw:
 *              type: string
 *              format: password
 *            autoLogin:
 *              type: boolean
 *          example:
 *            id: test
 *            pw: test
 *            autoLogin: true
 *    responses:
 *      "201":
 *        description: JWT 쿠키로 발급
 *        headers:
 *          Set-Cookie:
 *            description: autoLogin=true 시, refreshToken 도 발급
 *            schema:
 *              type: string
 *              example:
 *                accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *      "401":
 *        description: 인증 오류
 */

export default router;