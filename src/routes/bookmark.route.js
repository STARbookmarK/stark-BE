import express from 'express';
import bookmarkController from '../controllers/bookmark.controller.js';
import authValidation from '../middlewares/auth.js';

const router = express.Router();

router.get('/api/bookmarks', authValidation, bookmarkController.getAllBookmark);
router.post('/api/bookmarks', authValidation, bookmarkController.addBookmark);
router.patch('/api/bookmarks', authValidation, bookmarkController.editBookmark);
router.delete('/api/bookmarks', authValidation, bookmarkController.deleteBookmark);

/**
 * @swagger
 * tags:
 *  name: bookmark
 *  description: 북마크 페이지 API
 */

/**
 * @swagger
 * /api/bookmarks:
 *  get:
 *    summary: 현재 로그인 된 유저의 모든 북마크 가져오는 API
 *    tags: [bookmark]
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: cookie
 *        name: accessToken
 *        description: accessToken 을 쿠키에 지닌 상태로 호출
 *        required: true
 *    responses:
 *      "200":
 *        description: 북마크 목록 json 형태로 반환
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              title:
 *                type: string
 *              address:
 *                type: string
 *              description:
 *                type: string
 *              rate:
 *                type: integer
 *              hashtags:
 *                type: string
 *            example: [
 *              {
 *                id: 2,
 *                title: "google",
 *                address: "https://www.google.com/",
 *                image: null,
 *                description: null,
 *                rate: 5,
 *                hashtags: 'sample3|sample2|sample'
 *              },
 *              {
 *                id: 1,
 *                title: "naver",
 *                address: "https://www.naver.com/",
 *                image: null,
 *                description: null,
 *                rate: 1,
 *                hashtags: 'sample3'
 *              },
 *              {
 *                id: 4,
 *                title: "youtube",
 *                address: "https://www.youtube.com/",
 *                image: null,
 *                description: null,
 *                rate: 4,
 *                hashtags: ''
 *              }
 *            ]
 *      "401":
 *        description: (서비스 사용 중) 토큰 만료 or 삭제
 *      "500":
 *        description: 서버 오류 
 */

/**
 * @swagger
 * /api/bookmarks:
 *  post:
 *    summary: 현재 로그인 된 유저의 북마크 추가 API
 *    tags: [bookmark]
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *            - title
 *            - address
 *            - description
 *            - rate
 *            - shared
 *            - hashtags
 *          properties:
 *            title:
 *              type: string
 *            address:
 *              type: string
 *            description:
 *              type: string
 *            rate:
 *              type: integer
 *            shared:
 *              type: integer
 *            hashtags:
 *              type: array
 *          example:
 *            title: naver
 *            address: https://www.naver.com
 *            description: 네이버
 *            rate: 5
 *            shared: 1
 *            hashtags: [web, naver]
 *    responses:
 *      "201":
 *        description: 북마크 추가됨
 *      "412":
 *        description: 북마크 추가 실패 (예 - 중복된 address 입력)
 *      "401":
 *        description: (서비스 사용 중) 토큰 만료 or 삭제
 *      "500":
 *        description: 서버 오류
 */

/**
 * @swagger
 * /api/bookmarks:
 *  get:
 *    summary: 현재 로그인 된 유저의 모든 북마크 가져오는 API
 *    tags: [bookmark]
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: cookie
 *        name: accessToken 
 *        description: accessToken 을 쿠키에 지닌 상태로 호출
 *        required: true
 *    responses:
 *      "200":
 *        description: 북마크 목록 json 형태로 반환
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              title:
 *                type: string
 *              address:
 *                type: string
 *              description:
 *                type: string
 *              rate:
 *                type: integer
 *              hashtags:
 *                type: string
 *            example: [
 *              {
 *                id: 2,
 *                title: "google",
 *                address: "https://www.google.com/",
 *                image: null,
 *                description: null,
 *                rate: 5,
 *                hashtags: 'sample3|sample2|sample'
 *              },
 *              {
 *                id: 1,
 *                title: "naver",
 *                address: "https://www.naver.com/",
 *                image: null,
 *                description: null,
 *                rate: 1,
 *                hashtags: 'sample3'
 *              },
 *              {
 *                id: 4,
 *                title: "youtube",
 *                address: "https://www.youtube.com/",
 *                image: null,
 *                description: null,
 *                rate: 4,
 *                hashtags: ''
 *              }
 *            ]
 *      "401":
 *        description: (서비스 사용 중) 토큰 만료 or 삭제
 *      "500":
 *        description: 서버 오류 
 */

/**
 * @swagger
 * /api/bookmarks:
 *  patch:
 *    summary: 현재 로그인 된 유저의 북마크 수정 API
 *    tags: [bookmark]
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *            - id
 *            - title
 *            - address
 *            - description
 *            - rate
 *            - shared
 *            - hashtags
 *          properties:
 *            id:
 *              type: integer
 *            title:
 *              type: string
 *            address:
 *              type: string
 *            description:
 *              type: string
 *            rate:
 *              type: integer
 *            shared:
 *              type: integer
 *            hashtags:
 *              type: array
 *          example:
 *            id: 3
 *            title: naver
 *            address: https://www.naver.com
 *            description: 네이버
 *            rate: 5
 *            shared: 1
 *            hashtags: [web, naver]
 *    responses:
 *      "204":
 *        description: 북마크 수정됨
 *      "401":
 *        description: (서비스 사용 중) 토큰 만료 or 삭제
 *      "500":
 *        description: 서버 오류 
 */

/**
 * @swagger
 * /api/bookmarks:
 *  delete:
 *    summary: 현재 로그인 된 유저의 특정 북마크 삭제 API
 *    tags: [bookmark]
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: integer
 *          example:
 *            id: 3
 *    responses:
 *      "204":
 *        description: 북마크 삭제됨
 *      "401":
 *        description: (서비스 사용 중) 토큰 만료 or 삭제
 *      "500":
 *        description: 서버 오류 
 */

export default router;