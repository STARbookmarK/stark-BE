import catchAsync from '../utils/catchAsync.js';
import httpStatus from 'http-status';
import bookmarkService from '../services/bookmark.service.js';

const getAllBookmark = catchAsync(async (req, res) => {
  const bookmarks = await bookmarkService.getAllBookmark(req.decode.id);
  return res.status(httpStatus.OK).json(bookmarks);
});

const addBookmark = catchAsync(async (req, res) => {
  const status = await bookmarkService.addBookmark(req.decode.id, req.body)
  if(status) return res.status(httpStatus.CREATED).send();
  else return res.status(httpStatus.PRECONDITION_FAILED).send();
});

export default {
  getAllBookmark,
  addBookmark
};