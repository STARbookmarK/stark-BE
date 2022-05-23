import authService from "../services/auth.service.js";
import tokenService from "../services/token.service.js";
import userService from "../services/user.service.js";

const cookieOption = {
  maxAge: 1000*60*60*24*60, // 60 day
  httpOnly: true
}

const login = async (req, res) => {
  try {
    const { id, pw, autoLogin } = req.body;
    const name = await authService.login(id, pw);
    const tokens = tokenService.generateAuthToken(id, name, autoLogin);
    res.cookie('accessToken', tokens.access, cookieOption);
    if (tokens.refresh) res.cookie('refreshToken', tokens.refresh, cookieOption);
    return res.status(200).json({
      code: 200,
      message: '토큰이 발급되었습니다.'
    });
  } catch (err) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message
    });
  }
}

const loginChk = async (req, res) => {
  res.status(200).json(req.decode);
}

const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({
    code: 200,
    message: '로그아웃 되었습니다.'
  });
}

const register = async (req, res) => {
  try {
    await userService.createUser(req.body);
    return res.status(200).json({
      code: 200,
      message: '회원가입 되었습니다'
    });
  } catch (err) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message
    });
  }
}

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