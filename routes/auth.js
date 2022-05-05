import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const cookieExpires = 1000*60*60*24*60; // 60 day

router.post('/api/login', (req, res) => {
	// 로그인
	const { id, pw, autoLogin } = req.body;
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
		const accessToken = jwt.sign({
			id: id,
			name: global.user[userIdx].name,
			tokenType: 'accessToken'
		}, process.env.JWT_SECRET, {
			expiresIn: '1h',
			issuer: 'stark'
		});
		res.cookie('accessToken', accessToken, {
			maxAge: cookieExpires,
			httpOnly: true // javascript 로 쿠키 접근 불가
		});
		if(autoLogin){
			const refreshToken = jwt.sign({
				id: id,
				name: global.user[userIdx].name,
				tokenType: 'refreshToken'
			}, process.env.JWT_SECRET, {
				expiresIn: '60d',
				issuer: 'stark'
			});
			res.cookie('refreshToken', refreshToken, {
				maxAge: cookieExpires, // 60 day
				httpOnly: true // javascript 로 쿠키 접근 불가
			});
		}
		return res.status(200).json({
			code: 200,
			message: '토큰이 발급되었습니다.'
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
		const decode = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
		if(decode.tokenType !== 'accessToken') throw '사용할 수 없는 토큰입니다.';
		return res.status(200).json(decode);
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			try{
				// refresh token 이 유효하면 access token 재발급
				const decode = jwt.verify(req.cookies.refreshToken, process.env.JWT_SECRET);
				const accessToken = jwt.sign({
					id: decode.id,
					name: decode.name,
					tokenType: 'accessToken'
				}, process.env.JWT_SECRET, {
					expiresIn: '1h',
					issuer: 'stark'
				});
				res.cookie('accessToken', accessToken, {
					maxAge: cookieExpires,
					httpOnly: true
				});
				console.log('token 재발급 됨');
				// 사용자 정보 전달을 위한 반환값이므로 access, refresh 어느 토큰의 값을 반환해줘도 상관이 없음.
				return res.status(200).json(decode);
			}
			catch (err) {
				// refresh token 의 예외처리
				if (err.name === 'TokenExpiredError') {
					return res.status(419).json({
						code: 419,
						message: '토큰이 만료되었습니다.'
					});
				}
				return res.status(401).json({
					code: 401,
					message: '유효하지 않은 refresh 토큰입니다.'
				});
			}
		}
		// access token 의 예외처리
		return res.status(401).json({
			code: 401,
			message: '유효하지 않은 access 토큰입니다.'
		});
	}
});

router.get('/api/logout', (req, res) => {
	res.clearCookie('accessToken');
	res.clearCookie('refreshToken');
	res.status(200).json({
		code: 200,
		message: '로그아웃 되었습니다.'
	})
});

export default router;