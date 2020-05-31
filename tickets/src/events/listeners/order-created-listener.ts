import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@hmtickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../model/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('ticket not found');
    }
    ticket.set({ orderId: data.id });
    await ticket.save();

    msg.ack();
  }
}
