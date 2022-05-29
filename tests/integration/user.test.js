import request from 'supertest';
import app from '../../src/app.js';
import tokenService from '../../src/services/token.service.js';
import httpStatus from 'http-status';

describe('user routes', () => {
  const testData = {
    id: 'root',
    pw: 'root',
    nickname: '관리자'
  };
  test('상태 메세지가 성공적으로 변경되면 204 를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '1h');
    const updateData = {
      info: new Date().toString()
    };
    await request(app)
      .patch('/api/infos')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(updateData)
      .expect(httpStatus.NO_CONTENT);
  });
  test('비밀번호가 성공적으로 변경되면 204 를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '1h');
    const updateData = {
      pw: testData.pw,
      newPw: testData.pw
    };
    await request(app)
      .patch('/api/password')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(updateData)
      .expect(httpStatus.NO_CONTENT);
  });
  test('일치하지 않는 현재 비밀번호가 입력되면 400 을 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '1h');
    const updateData = {
      pw: '',
      newPw: testData.pw
    };
    await request(app)
      .patch('/api/password')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(updateData)
      .expect(httpStatus.BAD_REQUEST);
  });
  test('보기 방식이 성공적으로 변경되면 204 를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '1h');
    const updateData = {
      bookmarkShow: 0,
      hashtagShow: 0,
      hashtagCategory: 0
    };
    await request(app)
      .patch('/api/show')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(updateData)
      .expect(httpStatus.NO_CONTENT);
  });
  test('현재 로그인 된 계정의 정보를 성공적으로 불러오면 200 를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '1h');
    const res = await request(app)
      .get('/api/infos')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(httpStatus.OK);
    expect(res.body).toEqual({
      user_id: expect.anything(),
      nickname: expect.anything(),
      info: expect.anything(),
      bookmarkshow: expect.anything(),
      hashtagshow: expect.anything(),
      hashtagcategory: expect.anything()
    });
  });
});