import request from 'supertest';
import app from '../../src/app.js';
import tokenService from '../../src/services/token.service.js';
import userService from '../../src/services/user.service.js';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';

describe('user routes', () => {
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

  test('로그인 된 유저의 북마크를 정상적으로 불러오면 200을 반환해야 한다.', async () => {
    const accessToken = tokenService.generateToken(newUser.id, newUser.nickname, 'accessToken', '1h');
    await request(app)
      .get('/api/bookmarks')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(httpStatus.OK);
  });

  afterAll(() => {
    userService.deleteUser(newUser.id);
  });
});