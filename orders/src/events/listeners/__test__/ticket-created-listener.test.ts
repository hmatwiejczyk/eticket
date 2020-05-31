import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@hmtickets/common';
import { Ticket } from '../../../model/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'concert',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

test('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined()
  expect(ticket?.title).toEqual(data.title)
  expect(ticket?.price).toEqual(data.price)
});

test('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
