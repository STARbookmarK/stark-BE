import httpStatus from 'http-status';
import models from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const User = models.User;

const getUserById = async (id) => {
  return User.findOne({
    attributes: ['user_id', 'password', 'nickname'],
    where: { user_id: id }
  });
}

const getUserByNickname = async (nickname) => {
  return User.findOne({
    attributes: ['user_id', 'password', 'nickname'],
    where: { nickname: nickname }
  });
}

const createUser = async (userBody) => {
  const { id, password, nickname, info } = userBody;
  return User.create({
    user_id: id,
    password: password,
    nickname: nickname,
    info: info
  });
}

const updateInfoById = async (id, info) => {
  if(!info) throw new ApiError(httpStatus.BAD_REQUEST);
  await User.update({ info: info }, { where: { user_id: id } });
}

const updatePasswordByIdAndPw = async (id, pw, newPw) => {
  if(!pw || !newPw) throw new ApiError(httpStatus.BAD_REQUEST);
  await User.update({ password: newPw }, { where: { user_id: id, password: pw }});
}

export default {
  getUserById,
  getUserByNickname,
  createUser,
  updateInfoById,
  updatePasswordByIdAndPw
};