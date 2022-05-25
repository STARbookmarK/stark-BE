import authService from '../services/auth.service.js';
import tokenService from '../services/token.service.js';
import userService from '../services/user.service.js';
import config from '../config/config.js';
import catchAsync from '../utils/catchAsync.js';

const login = catchAsync(async (req, res) => {
  const { id, pw, autoLogin } = req.body;
  const name = await authService.login(id, pw);
  const tokens = tokenService.generateAuthToken(id, name, autoLogin);
  res.cookie('accessToken', tokens.access, config.cookie.option);
  if (tokens.refresh) res.cookie('refreshToken', tokens.refresh, config.cookie.option);
  return res.status(200).json({ tokens });
});

// 해당 컨트롤러가 실행되었다는 것은 토큰 검증을 통과했다는 뜻
const loginChk = async (req, res) => {
  res.status(200).json(req.decode);
}

const logout = (req, res) => {
  res.clearCookie('accessToken'); // 서비스에서 처리
  res.clearCookie('refreshToken');
  res.status(200).json({
    code: 200,
    message: '로그아웃 되었습니다.'
  });
}

const register = catchAsync(async (req, res) => {
  await userService.createUser(req.body);
  return res.status(200).send();
});

const idDupChk = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userid);
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
}

const nicknameDupChk = async (req, res) => {
  try {
    const user = await userService.getUserByNickname(req.params.nickname);
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
}

export default {
  login,
  loginChk,
  logout,
  register,
  idDupChk,
  nicknameDupChk
};