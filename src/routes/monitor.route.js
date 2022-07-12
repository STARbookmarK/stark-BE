import express from 'express';
import models from '../models/index.js';

const User = models.user;
const router = express.Router();

// db create 확인을 위한 임시 라우터

router.get('/api/monitor', async (req, res) => {
  try {
    const user = await User.findAll()
    return res.status(200).json({
      data: user
    });
  } catch (err) {
    return res.status(500).json({
			code: 500,
			message: '서버 에러'
		});
  }
});

export default router;