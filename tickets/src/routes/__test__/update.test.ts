import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../model/ticket';


test('returns a 404 if provided id not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
    })
    .expect(404);
});

test('returns a 401 if user is not auth', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test',
      price: 20,
    })
    .expect(401);
});

test('returns a 401 if user does not own ticket', async () => {
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'book',
      price: 10,
    })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'book1',
      price: 20,
    })
    .expect(401);
});

test('returns a 400 if user provide an invalid title or password', async () => {
  const cookie = global.signin();
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 10,
    })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: -20,
    })
    .expect(400);
});

test('update ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 10,
    })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'book1',
      price: 20,
    })
    .expect(200);
  const updateResponse = await request(app)
    .get(`/api/tickets/${createResponse.body.id}`)
    .send();
  expect(updateResponse.body.title).toEqual('book1');
  expect(updateResponse.body.price).toEqual(20);
});

test('publishes an event', async () => {
  const cookie = global.signin();
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 10,
    })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'book1',
      price: 20,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})

test('rejects updates if the ticket is reserved', async() => {
  const cookie = global.signin();
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 10,
    })
  const ticket = await Ticket.findById(createResponse.body.id);
  ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString()});
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'book1',
      price: 20,
    })
    .expect(400);
})
