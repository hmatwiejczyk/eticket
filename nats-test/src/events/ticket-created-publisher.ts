import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-events';
import { Publisher } from './base-publisher';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
