import { OrderCancelledPublisher } from './../events/publishers/order-cancelled-publisher';
import express, { Router, Request, Response } from 'express';
import { Order, OrderStatus } from '../model/order';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@hmtickets/common';
import { natsWrapper } from '../nats-wrapper';

const router: Router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
