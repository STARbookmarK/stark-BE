import catchAsync from '../utils/catchAsync.js';
import httpStatus from 'http-status';
import bookmarkService from '../services/bookmark.service.js';

const getAllBookmark = catchAsync(async (req, res) => {
  const bookmarks = await bookmarkService.getAllBookmark(req.decode.id);
  return res.status(httpStatus.OK).json(bookmarks);
});

export default {
  getAllBookmark
};