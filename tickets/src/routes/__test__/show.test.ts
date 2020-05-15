import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose'

test('returns a 404 if the ticket is not fount', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

test('returns the ticket if the ticket is found', async () => {
  const data = { title: 'book', price: 10 };
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: data.title,
      price: data.price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual(data.title);
  expect(ticketResponse.body.price).toEqual(data.price);
});
