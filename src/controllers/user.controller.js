import catchAsync from '../utils/catchAsync.js';
import userService from '../services/user.service.js';
import httpStatus from 'http-status';

const updateInfo = catchAsync(async (req, res) => {
  await userService.updateInfoById(req.decode.id, req.body.info);
  return res.status(httpStatus.NO_CONTENT).send();
});

const updatePassword = catchAsync(async (req, res) => {
  await userService.updatePasswordByIdAndPw(req.decode.id, req.body.pw, req.body.newPw);
  return res.status(httpStatus.NO_CONTENT).send();
});

const updateShow = catchAsync(async (req, res) => {
  await userService.updateShowById(req.decode.id, req.body);
  return res.status(httpStatus.NO_CONTENT).send();
});

const getUserInfo = catchAsync(async (req, res) => {
  const user = await userService.getUserInfoById(req.decode.id);
  return res.status(httpStatus.OK).json(user);
});

export default {
  updateInfo,
  updatePassword,
  updateShow,
  getUserInfo
};