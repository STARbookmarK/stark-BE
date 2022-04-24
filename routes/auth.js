import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/login', (req, res) => {
	// 로그인
	const { id, pw } = req.body;
	try {
		const userIdx = global.user.findIndex(x => x.id === id);
		if(userIdx === -1) {
			return res.status(401).json({
				code: 401,
				message: '가입되지 않은 회원입니다.'
			});
		}
		if(global.user[userIdx].pw !== pw){
			return res.status(401).json({
				code: 401,
				message: '비밀번호가 일치하지 않습니다.'
			});
		}
		const token = jwt.sign({
			id: id,
			name: global.user[userIdx].name
		}, process.env.JWT_SECRET, {
			expiresIn: '3m',
			issuer: 'stark'
		});
		res.cookie('jwt', { token });
		return res.json({
			code: 200,
			message: '토큰이 발급되었습니다.',
			token
		});
	} catch (err) {
		return res.status(500).json({
			code: 500,
			message: '서버 에러'
		});
	}
});

router.get('/api/login', (req, res) => {
	// 토큰 유효성 검사
	try {
		req.decode = jwt.verify(req.cookies.jwt.token, process.env.JWT_SECRET);
		return res.json(req.decode);
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(419).json({
				code: 419,
				message: '토큰이 만료되었습니다.'
			});
		}
		return res.status(401).json({
			code: 401,
			message: '유효하지 않은 토큰입니다.'
		});
	}
});

export default router;