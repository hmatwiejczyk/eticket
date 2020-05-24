import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { Order, OrderStatus } from '../../model/order';
import mongoose from 'mongoose';

test('return an error if ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

test('return an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'randomsring',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

test('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

test.todo('emits an order created event');
