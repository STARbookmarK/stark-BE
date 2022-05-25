import request from 'supertest';
import app from '../../src/app.js';
import tokenService from '../../src/services/token.service.js';
import cookie from 'cookie';
import httpStatus from 'http-status';

describe('login', () => {
  const testData = {
    id: 'wjdgus',
    pw: 'wjdgus',
    nickname: '정현'
  };
  test('자동 로그인이 활성화 된 상태에서 로그인 성공 시 200 을 반환해야 한다.', async () => {
    const loginData = {
      id: testData.id,
      pw: testData.pw,
      autoLogin: true
    };
    const res = await request(app).post('/api/login').send(loginData).expect(httpStatus.OK);
    expect(res.body.tokens).toEqual({
      access: expect.anything(),
      refresh: expect.anything()
    });
  });
  test('자동 로그인이 비활성화 된 상태에서 로그인 성공 시 200 을 반환해야 한다.', async () => {
    const loginData = {
      id: testData.id,
      pw: testData.pw,
      autoLogin: false
    };
    const res = await request(app).post('/api/login').send(loginData).expect(httpStatus.OK);
    expect(res.body.tokens).toEqual({
      access: expect.anything(),
      refresh: null
    });
  });
  test('존재하지 않는 아이디가 입력되었을 경우 401 에러를 반환해야 한다.', async () => {
    const loginData = {
      id: 'IllllIIIlIllI',
      pw: '',
      autoLogin: false
    };
    await request(app).post('/api/login').send(loginData).expect(httpStatus.UNAUTHORIZED);
  })
  test('유효하지 않은 접근 토큰이 주어질 경우 401 에러를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, '', '1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(httpStatus.UNAUTHORIZED);
  });
  test('유효한 접근 토큰이 주어질 경우 200 을 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(httpStatus.OK);
  });
  test('만료된 접근 토큰과, 유효하지 않은 갱신 토큰이 주어질 경우 401 에러를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '-1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, 'refreshToken=""'])
      .expect(httpStatus.UNAUTHORIZED);
  });
  test('만료된 접근 토큰과, 만료된 갱신 토큰이 주어질 경우 401 에러를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '-1h');
    const refreshToken = tokenService.generateToken(testData.id, testData.nickname, 'refreshToken', '-1d');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
      .expect(httpStatus.UNAUTHORIZED);
  });
  test('만료된 접근 토큰과, 유효한 갱신 토큰이 주어질 경우 200 을 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '-1h');
    const refreshToken = tokenService.generateToken(testData.id, testData.nickname, 'refreshToken', '1d');
    const res = await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
      .expect(httpStatus.OK);
    let tokens = {};
    for(let c of res.header['set-cookie']){
      tokens = { ...tokens, ...cookie.parse(c) }
    }
    expect(tokens).not.toEqual({
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  });
});