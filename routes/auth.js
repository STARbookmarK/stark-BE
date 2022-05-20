import express from 'express';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';

const User = models.User;
const router = express.Router();
const cookieExpires = 1000*60*60*24*60; // 60 day

router.post('/api/login', async (req, res) => {
	// 로그인
	const { id, pw, autoLogin } = req.body;
	try{
		const user = await User.findOne({
			attributes: ['user_id', 'password', 'nickname'],
			where: { user_id: id }
		})
		if(!user){
			return res.status(401).json({
				code: 401,
				message: '가입되지 않은 회원입니다.'
			});
		}
		if(user.dataValues.password !== pw){
			return res.status(401).json({
				code: 401,
				message: '비밀번호가 일치하지 않습니다.'
			});
		}
		const name = user.dataValues.nickname;
		const accessToken = jwt.sign({
			id: id,
			name: name,
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
				name: name,
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
				// 사용자 정보 전달을 위한 반환값이므로 access, refresh 어느 토큰의 값을 반환해줘도 상관이 없음.
				return res.status(200).json(decode);
			}
			catch (err) {
				if (err.name === 'TokenExpiredError') {
					return res.status(419).json({
						code: 419,
						message: 'refresh 토큰이 만료되었습니다.'
					});
				}
				return res.status(401).json({
					code: 401,
					message: '유효하지 않은 refresh 토큰입니다.'
				});
			}
		}
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
	});
});

router.post('/api/register', async (req, res) => {
	const { id, password, nickname, info} = req.body;
	try{
		await User.create({
			user_id: id,
			password: password,
			nickname: nickname,
			info: info
		})
		return res.status(200).json({
			code: 200,
			message: '회원가입 되었습니다'
		});
	} catch (err) {
		return res.status(500).json({
			code: 500,
			message: '서버 에러'
		});
	}
});

router.get('/api/register/id/:userid', async (req, res) => {
	// id 중복 검사
	const id = req.params.userid;
	try {
		const user = await User.findOne({
			attributes: ['user_id'],
			where: { user_id: id }
		})
		return res.status(200).json({
			code: 200,
			valid: user ? false : true
		});
	} catch (err) {
		return res.status(500).json({
			code: 500,
			message: '서버 에러'
		});
	}
});

router.get('/api/register/name/:nickname', async (req, res) => {
	// nickname 중복 검사
	const nickname = req.params.nickname;
	try {
		const user = await User.findOne({
			attributes: ['user_id'],
			where: { nickname: nickname }
		})
		return res.status(200).json({
			code: 200,
			valid: user ? false : true
		});
	} catch (err) {
		return res.status(500).json({
			code: 500,
			message: '서버 에러'
		});
	}
});

export default router;