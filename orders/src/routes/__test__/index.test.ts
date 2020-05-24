import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { Order, OrderStatus } from '../../model/order';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

test('fetches orders for an particular user', async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  // user #1 orders one ticket
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  // user #2 orders two tickets
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .expect(200);
  const { body: orderTwo} = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(orderOne.length).toEqual(1);
  expect(orderTwo.length).toEqual(2);
});
