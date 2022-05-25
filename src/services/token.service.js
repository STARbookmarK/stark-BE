import httpStatus from 'http-status';
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

const generateAuthToken = (id, name) => {
  return {
    access: generateToken(id, name, 'accessToken', config.jwt.expires.access),
    refresh: generateToken(id, name, 'refreshToken', config.jwt.expires.refresh)
  };
}

const saveTokenInCookie = (tokens, autoLogin, res) => {
  res.cookie('accessToken', tokens.access, config.cookie.option);
  if(autoLogin) res.cookie('refreshToken', tokens.refresh, config.cookie.option);
}

const decodeToken = (token) => {
  return jwt.decode(token, config.jwt.secret);
}

const verifyToken = (cookies, res) => {
  const { accessToken, refreshToken } = cookies;
  let decode, tokenExpDate;
  const currentDate = new Date();
  decode = decodeToken(accessToken);
  if(!decode || decode.tokenType !== 'accessToken') throw new ApiError(httpStatus.UNAUTHORIZED, '유효하지 않은 access 토큰입니다.');
  tokenExpDate = new Date(decode.exp*1000);
  if(tokenExpDate >= currentDate) return decode;
  // refresh token 이 유효하면 access, refresh token 재발급
  decode = decodeToken(refreshToken);
  if(!decode || decode.tokenType !== 'refreshToken') throw new ApiError(httpStatus.UNAUTHORIZED, '유효하지 않은 access 토큰입니다.');
  tokenExpDate = new Date(decode.exp*1000);
  if(tokenExpDate < currentDate) throw new ApiError(httpStatus.UNAUTHORIZED, '토큰이 만료되었습니다.');
  const { id, name } = decode;
  const tokens = generateAuthToken(id, name);
  saveTokenInCookie(tokens, true, res);
  return decode;
}

export default {
  generateToken,
  generateAuthToken,
  saveTokenInCookie,
  decodeToken,
  verifyToken
};