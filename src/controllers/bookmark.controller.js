import catchAsync from '../utils/catchAsync.js';
import httpStatus from 'http-status';
import bookmarkService from '../services/bookmark.service.js';

const getAllBookmark = catchAsync(async (req, res) => {
  const bookmarks = await bookmarkService.getAllBookmark(req.decode.id);
  return res.status(httpStatus.OK).json(bookmarks);
});

const addBookmark = catchAsync(async (req, res) => {
  const status = await bookmarkService.addBookmark(req.decode.id, req.body);
  if(status) return res.status(httpStatus.CREATED).send();
  else return res.status(httpStatus.PRECONDITION_FAILED).send();
});

const editBookmark = catchAsync(async (req, res) => {
  await bookmarkService.editBookmark(req.decode.id, req.body);
  return res.status(httpStatus.NO_CONTENT).send();
});

const deleteBookmark = catchAsync(async (req, res) => {
  await bookmarkService.deleteBookmark(req.decode.id, req.body.id);
  return res.status(httpStatus.NO_CONTENT).send();
});

const getAllHashtag = catchAsync(async (req, res) => {
  const hashtags = await bookmarkService.getAllHashtag(req.decode.id);
  return res.status(httpStatus.OK).json(hashtags);
});

export default {
  getAllBookmark,
  addBookmark,
  editBookmark,
  deleteBookmark,
  getAllHashtag
};