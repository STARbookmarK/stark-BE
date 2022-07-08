import express from 'express';
import bookmarkController from '../controllers/bookmark.controller.js';
import authValidation from '../middlewares/auth.js';

const router = express.Router();

router.get('/api/bookmarks', authValidation, bookmarkController.getAllBookmark);

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
 *          example: [
 *            {
 *              id: 2,
 *              title: "google",
 *              address: "https://www.google.com/",
 *              image: null,
 *              description: null,
 *              rate: 5,
 *              hashtags: 'sample3|sample2|sample'
 *            },
 *            {
 *              id: 1,
 *              title: "naver",
 *              address: "https://www.naver.com/",
 *              image: null,
 *              description: null,
 *              rate: 1,
 *              hashtags: 'sample3'
 *            },
 *            {
 *              id: 4,
 *              title: "youtube",
 *              address: "https://www.youtube.com/",
 *              image: null,
 *              description: null,
 *              rate: 4,
 *              hashtags: ''
 *            }
 *          ]
 *      "401":
 *        description: (서비스 사용 중) 토큰 만료 or 삭제
 *      "500":
 *        description: 서버 오류 
 */

export default router;