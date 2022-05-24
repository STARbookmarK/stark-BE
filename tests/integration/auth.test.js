import request from 'supertest';
import app from '../../src/app.js';

describe('login', () => {
  test('로그인 성공 시 200 을 반환, 자동 로그인 활성화', async () => {
    const loginData = {
      id: 'wjdgus',
      pw: 'wjdgus',
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
      id: 'wjdgus',
      pw: 'wjdgus',
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
      id: '',
      pw: '',
      autoLogin: false
    }
    await request(app).post('/api/login').send(loginData).expect(401);
  });
});