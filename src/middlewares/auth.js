import jwt from 'jsonwebtoken';
import configFile from '../config/config.js';
import tokenService from '../services/token.service.js';

const cookieOption = {
  maxAge: 1000*60*60*24*60, // 60 day
  httpOnly: true
}

// controller 와 같은 위치
const verifyToken = (req, res, next) => {
  try {
    req.decode = jwt.verify(req.cookies.accessToken, configFile.jwt.secret);
    if (req.decode.tokenType !== 'accessToken') throw '사용할 수 없는 토큰입니다.';
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // refresh token 이 유효하면 access token 재발급
      try {
        const decode = jwt.verify(req.cookies.refreshToken, configFile.jwt.secret);
        const { id, name } = decode;
        const accessToken = tokenService.generateToken(id, name, 'accessToken', '1h');
        res.cookie('accessToken', accessToken, cookieOption);
        // 사용자 정보 전달을 위한 반환값이므로 access, refresh 어느 토큰의 값을 반환해줘도 상관이 없음.
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