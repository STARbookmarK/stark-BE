import httpStatus from 'http-status';
import models from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const User = models.user;
const Category = models.category;

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

const getUserInfoById = async (id) => {
  return User.findOne({
    attributes: ['user_id', 'nickname', 'info', 'bookmarkshow', 'hashtagshow', 'hashtagcategory'],
    where: { user_id: id }
  });
}

const createUser = async (userBody) => {
  const { id, password, nickname, info } = userBody;
  User.create({
    user_id: id,
    password: password,
    nickname: nickname,
    info: info
  });
  Category.create({
    title: 'default',
    user_user_id: id
  });
}

const deleteUser = (id) => {
  User.destroy({ where: { user_id: id } });
}

const updateInfoById = async (id, info) => {
  if(info === undefined || info === null) throw new ApiError(httpStatus.BAD_REQUEST);
  await User.update({ info: info }, { where: { user_id: id } });
}

const updatePasswordByIdAndPw = async (id, pw, newPw) => {
  if(!pw || !newPw) throw new ApiError(httpStatus.BAD_REQUEST);
  const res = await getUserById(id);
  if(res.dataValues.password !== pw) throw new ApiError(httpStatus.BAD_REQUEST);
  await User.update({ password: newPw }, { where: { user_id: id, password: pw }});
}

const updateShowById = async (id, show) => {
  const { bookmarkShow, hashtagShow, hashtagCategory } = show;
  await User.update({
    bookmarkshow: bookmarkShow,
    hashtagshow: hashtagShow,
    hashtagcategory: hashtagCategory
  }, {
    where: {
      user_id: id
    }
  });
}

export default {
  getUserById,
  getUserByNickname,
  getUserInfoById,
  createUser,
  deleteUser,
  updateInfoById,
  updatePasswordByIdAndPw,
  updateShowById
};