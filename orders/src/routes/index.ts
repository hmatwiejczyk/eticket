import express, { Router, Request, Response } from 'express';
import { requireAuth } from '@hmtickets/common';
import { Order } from '../model/order';

const router: Router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');
  res.send(orders);
});

export { router as indexOrderRouter };
