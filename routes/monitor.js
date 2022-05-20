import express from 'express';
import models from '../models/index.js';

const User = models.User;
const router = express.Router();

router.get('/api/monitor', async (req, res) => {
  try{
    const user = await User.findAll({
      attributes: ['user_id', 'password', 'nickname', 'info']
    })
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