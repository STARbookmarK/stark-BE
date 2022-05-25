import request from 'supertest';
import app from '../../src/app.js';
import tokenService from '../../src/services/token.service.js';
import cookie from 'cookie';

describe('login', () => {
  const testData = {
    id: 'wjdgus',
    pw: 'wjdgus',
    nickname: '정현'
  }
  test('로그인 성공 시 200 을 반환, 자동 로그인 활성화', async () => {
    const loginData = {
      id: testData.id,
      pw: testData.pw,
      autoLogin: true
    }
    const res = await request(app).post('/api/login').send(loginData).expect(200);
    expect(res.body.tokens).toEqual({
      access: expect.anything(),
      refresh: expect.anything()
    });
  });
  test('로그인 성공 시 200 을 반환, 자동 로그인 비활성화', async () => {
    const loginData = {
      id: testData.id,
      pw: testData.pw,
      autoLogin: false
    }
    const res = await request(app).post('/api/login').send(loginData).expect(200);
    expect(res.body.tokens).toEqual({
      access: expect.anything(),
      refresh: null
    });
  });
  test('존재하지 않는 아이디 입력, 일치하지 않는 비밀번호 일 경우 401 반환', async () => {
    const loginData = {
      id: 'IllllIIIlIllI',
      pw: '',
      autoLogin: false
    }
    await request(app).post('/api/login').send(loginData).expect(401);
  })
  test('invalid access token', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, '', '1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(401);
  });
  test('valid access token', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(200);
  });
  test('expired access token, invalid refresh token', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '-1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, 'refreshToken=""'])
      .expect(401);
  });
  test('expired access token, expired refresh token', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '-1h');
    const refreshToken = tokenService.generateToken(testData.id, testData.nickname, 'refreshToken', '-1d');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
      .expect(419);
  });
  test('expired access token, valid refresh token', async () => {
    const accessToken = tokenService.generateToken(testData.id, testData.nickname, 'accessToken', '-1h');
    const refreshToken = tokenService.generateToken(testData.id, testData.nickname, 'refreshToken', '1d');
    const res = await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
      .expect(200);
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