import models from '../models/index.js';
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

export default {
  getUserById,
  getUserByNickname,
  createUser
};