import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';

test('fetches the order', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

test('returns an error if one user tries to fetch another users order ', async () => {
  const ticketOne = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  });
  await ticketOne.save();
  const userOne = global.signin();
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);
  const userTwo = global.signin();
  await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});
