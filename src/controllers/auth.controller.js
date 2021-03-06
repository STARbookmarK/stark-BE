import authService from '../services/auth.service.js';
import tokenService from '../services/token.service.js';
import userService from '../services/user.service.js';
import catchAsync from '../utils/catchAsync.js';
import httpStatus from 'http-status';

const login = catchAsync(async (req, res) => {
  const { id, pw, autoLogin } = req.body;
  const name = await authService.login(id, pw);
  const tokens = tokenService.generateAuthToken(id, name);
  tokenService.saveTokenInCookie(tokens, autoLogin, res);
  return res.status(httpStatus.CREATED).send();
});

// 해당 컨트롤러가 실행되었다는 것은 토큰 검증을 통과했다는 뜻
const loginChk = (req, res) => {
  res.status(httpStatus.OK).json(req.decode);
};

const logout = (req, res) => {
  authService.logout(res);
  res.status(httpStatus.OK).send();
}

const register = catchAsync(async (req, res) => {
  await userService.createUser(req.body);
  return res.status(httpStatus.CREATED).send();
});

const idDupChk = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userid);
  return res.status(httpStatus.OK).json({ valid: user ? false : true });
});

const nicknameDupChk = catchAsync(async (req, res) => {
  const user = await userService.getUserByNickname(req.params.nickname);
  return res.status(httpStatus.OK).json({ valid: user ? false : true });
});

export default {
  login,
  loginChk,
  logout,
  register,
  idDupChk,
  nicknameDupChk
};