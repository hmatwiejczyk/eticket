import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { OrderStatus, Order } from '../../model/order';

test('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

  const otherUser = global.signin();
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', otherUser)
    .send()
    .expect(401);
});

test.todo('emits a order cancelled event');