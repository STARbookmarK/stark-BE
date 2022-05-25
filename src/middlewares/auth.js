import tokenService from '../services/token.service.js';

// controller 와 같은 계층에 놓인 미들웨어
// 토큰 유효성 검사를 진행하고 사용 가능한 토큰이면
// req.decode 에 쿠키를 담은 후 다음 미들웨어로 보냄
const verifyToken = (req, res, next) => {
  try{
    req.decode = tokenService.verifyToken(req.cookies, res);
    return next();
  } catch (err) {
    next(err);
  }
}

export default verifyToken;