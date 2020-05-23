import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

// export interface TicketUpdatedEvent {
//   subject: Subjects.OrderUpdated;
//   data: {
//     id: string;
//     title: string;
//     price: number;
//   }
// }
