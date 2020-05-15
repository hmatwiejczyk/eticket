import request from 'supertest';
import { app } from '../../app';

test('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});
test('returns a 400 on failed singnup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: '',
    })
    .expect(400)
    .then((response) => {
      expect(response.body.errors[0].message).toBe('Email must be valid');
      expect(response.body.errors[1].message).toBe(
        'Password must be between 4 and 20 characters'
      );
    });
});
test('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234'
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234'
    })
    .expect(400);
});

test('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
