import request from 'supertest';
import app from '../../src/app.js';
import tokenService from '../../src/services/token.service.js';
import userService from '../../src/services/user.service.js';
import cookie from 'cookie';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';

describe('auth routes', () => {
  let newUser;

  beforeAll(async () => {
    newUser = {
      id: faker.name.firstName(),
      password: faker.internet.password(),
      nickname: faker.name.firstName(),
      info: faker.address.city()
    }
    await userService.createUser(newUser);
  });

  test('자동 로그인이 활성화 된 상태에서 로그인 성공 시 201 을 반환해야 한다.', async () => {
    const loginData = {
      id: newUser.id,
      pw: newUser.password,
      autoLogin: true
    };
    const res = await request(app).post('/api/login').send(loginData).expect(httpStatus.CREATED);
    let tokens = {};
    for(let c of res.header['set-cookie']){
      tokens = { ...tokens, ...cookie.parse(c) }
    }
    expect(tokens).toHaveProperty('accessToken', expect.anything());
    expect(tokens).toHaveProperty('refreshToken', expect.anything());
  });
  test('자동 로그인이 비활성화 된 상태에서 로그인 성공 시 201 을 반환해야 한다.', async () => {
    const loginData = {
      id: newUser.id,
      pw: newUser.password,
      autoLogin: false
    };
    const res = await request(app).post('/api/login').send(loginData).expect(httpStatus.CREATED);
    let tokens = {};
    for(let c of res.header['set-cookie']){
      tokens = { ...tokens, ...cookie.parse(c) }
    }
    expect(tokens).toHaveProperty('accessToken', expect.anything());
    expect(tokens).not.toHaveProperty('refreshToken');

  });
  test('존재하지 않는 아이디가 입력되었을 경우 401 에러를 반환해야 한다.', async () => {
    const loginData = { id: '', pw: '', autoLogin: false };
    await request(app).post('/api/login').send(loginData).expect(httpStatus.UNAUTHORIZED);
  })
  test('유효하지 않은 접근 토큰이 주어질 경우 401 에러를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(newUser.id, newUser.nickname, '', '1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(httpStatus.UNAUTHORIZED);
  });
  test('유효한 접근 토큰이 주어질 경우 200 을 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(newUser.id, newUser.nickname, 'accessToken', '1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(httpStatus.OK);
  });
  test('만료된 접근 토큰과, 유효하지 않은 갱신 토큰이 주어질 경우 401 에러를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(newUser.id, newUser.nickname, 'accessToken', '-1h');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, 'refreshToken=""'])
      .expect(httpStatus.UNAUTHORIZED);
  });
  test('만료된 접근 토큰과, 만료된 갱신 토큰이 주어질 경우 401 에러를 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(newUser.id, newUser.nickname, 'accessToken', '-1h');
    const refreshToken = tokenService.generateToken(newUser.id, newUser.nickname, 'refreshToken', '-1d');
    await request(app)
      .get('/api/login')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
      .expect(httpStatus.UNAUTHORIZED);
  });
  test('만료된 접근 토큰과, 유효한 갱신 토큰이 주어질 경우 200 을 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(newUser.id, newUser.nickname, 'accessToken', '-1h');
    const refreshToken = tokenService.generateToken(newUser.id, newUser.nickname, 'refreshToken', '1d');
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
  test('로그아웃 시 토큰 쿠키를 모두 제거하고 200 을 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(newUser.id, newUser.nickname, 'accessToken', '1h');
    const refreshToken = tokenService.generateToken(newUser.id, newUser.nickname, 'refreshToken', '1d');
    const res = await request(app)
      .get('/api/logout')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
      .expect(httpStatus.OK);
    let tokens = {};
    for(let c of res.header['set-cookie']){
      tokens = { ...tokens, ...cookie.parse(c) }
    }
    expect(tokens).toHaveProperty('accessToken', '');
    expect(tokens).toHaveProperty('refreshToken', '');
  });
  test('중복된 아이디가 존재할 경우 body.valid 에 false 를 담아 반환해야 한다.', async () => {
    const res = await request(app).get(`/api/register/id/${newUser.id}`).expect(httpStatus.OK);
    expect(res.body.valid).toEqual(false);
  });
  test('중복된 아이디가 존재하지 않을 경우 body.valid 에 true 를 담아 반환해야 한다.', async () => {
    const res = await request(app).get(`/api/register/id/${faker.name.firstName()}`).expect(httpStatus.OK);
    expect(res.body.valid).toEqual(true);
  });
  test('중복된 닉네임이 존재할 경우 body.valid 에 false 를 담아 반환해야 한다.', async () => {
    const res = await request(app).get(`/api/register/name/${newUser.nickname}`).expect(httpStatus.OK);
    expect(res.body.valid).toEqual(false);
  });
  test('중복된 닉네임이 존재하지 않을 경우 body.valid 에 true 를 담아 반환해야 한다.', async () => {
    const res = await request(app).get(`/api/register/name/${faker.name.firstName()}}`).expect(httpStatus.OK);
    expect(res.body.valid).toEqual(true);
  });

  afterAll(() => {
    userService.deleteUser(newUser.id);
  });
});