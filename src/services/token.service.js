import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import configFile from '../config/config.js';

const generateToken = (id, name, type, expiresIn) => {
  return jwt.sign({
    id: id,
    name: name,
    tokenType: type
  }, configFile.jwt.secret, {
    expiresIn: expiresIn,
    issuer: 'stark'
  });
}

const generateAuthToken = (id, name, autoLogin) => {
  return {
    access: generateToken(id, name, 'accessToken', '1h'),
    refresh: autoLogin ? generateToken(id, name, 'refreshToken', '60d') : null
  };
}

export default {
  generateToken,
  generateAuthToken
};