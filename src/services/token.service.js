import jwt from 'jsonwebtoken';
import config from '../config/config.js';

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

const verifyToken = (token) => {
  return jwt.decode(token, config.jwt.secret);
}

export default {
  generateToken,
  generateAuthToken,
  verifyToken
};