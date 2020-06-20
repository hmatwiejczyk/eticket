import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@hmtickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 10,
    userId: 'fsdfdsf',
  });
  await order.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'fdfdf',
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

test('update status of the order', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

test('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
