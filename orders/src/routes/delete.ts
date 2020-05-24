import express, { Router, Request, Response } from 'express';
// import { orders } from '../model/orders';

const router: Router = express.Router();

router.delete(
  '/api/orders/:orderId',
  async (req: Request, res: Response) => {
    // const tickets = await Ticket.find({});
    // res.status(200).send(tickets); 
    res.send({});
  }
);

export { router as deleteOrderRouter };
