import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import ApiError from '../utils/ApiError.js';

const generateToken = (id, name, type, expires) => {
  return jwt.sign({
    id: id,
    name: name,
    tokenType: type
  }, config.jwt.secret, {
    expiresIn: expires,
    issuer: 'stark'
  });
}

const generateAuthToken = (id, name, autoLogin) => {
  return {
    access: generateToken(id, name, 'accessToken', config.jwt.expires.access),
    refresh: autoLogin ? generateToken(id, name, 'refreshToken', config.jwt.expires.refresh) : null
  };
}

const decodeToken = (token) => {
  return jwt.decode(token, config.jwt.secret);
}

const verifyToken = (cookies, res) => {
  const { accessToken, refreshToken } = cookies;
  let decode, tokenExpDate;
  const currentDate = new Date();
  decode = decodeToken(accessToken);
  if(!decode || decode.tokenType !== 'accessToken') throw new ApiError(401, '유효하지 않은 access 토큰입니다.');
  tokenExpDate = new Date(decode.exp*1000);
  if(tokenExpDate >= currentDate) return decode;
  // refresh token 이 유효하면 access, refresh token 재발급
  decode = decodeToken(refreshToken);
  if(!decode || decode.tokenType !== 'refreshToken') throw new ApiError(401, '유효하지 않은 access 토큰입니다.');
  tokenExpDate = new Date(decode.exp*1000);
  if(tokenExpDate < currentDate) throw new ApiError(419, '토큰이 만료되었습니다.');
  const { id, name } = decode;
  const tokens = generateAuthToken(id, name, true);
  res.cookie('accessToken', tokens.access, config.cookie.option);
  res.cookie('refreshToken', tokens.refresh, config.cookie.option);
  return decode;
}

export default {
  generateToken,
  generateAuthToken,
  decodeToken,
  verifyToken
};