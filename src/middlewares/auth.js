import config from '../config/config.js';
import tokenService from '../services/token.service.js';

// controller 와 같은 계층에 놓인 미들웨어
// 토큰 유효성 검사를 진행하고 사용 가능한 토큰이면
// req.decode 에 쿠키를 담은 후 다음 미들웨어로 보냄
const verifyToken = (req, res, next) => {
  try {
    req.decode = tokenService.verifyToken(req.cookies.accessToken);
    if (req.decode.tokenType !== 'accessToken') throw '사용할 수 없는 토큰입니다.';
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // refresh token 이 유효하면 access, refresh token 재발급
      try {
        req.decode = tokenService.verifyToken(req.cookies.refreshToken);
        const { id, name } = req.decode;
        const tokens = tokenService.generateAuthToken(id, name, true);
        res.cookie('accessToken', tokens.accessToken, config.cookie.option);
        res.cookie('refreshToekn', tokens.refreshToken, config.cookie.option);
        return next();
      } catch (err) {
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
}

export default verifyToken;