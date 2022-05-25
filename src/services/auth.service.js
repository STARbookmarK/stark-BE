import userService from './user.service.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

const login = async (id, pw) => {
  const user = await userService.getUserById(id)
  if(!user) throw new ApiError(httpStatus.UNAUTHORIZED, "가입되지 않은 회원입니다.");
  if(user.dataValues.password !== pw) throw new ApiError(httpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다.");
  return user.dataValues.nickname;
}

const logout = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}

export default {
  login,
  logout
};