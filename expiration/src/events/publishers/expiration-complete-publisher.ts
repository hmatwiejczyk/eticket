import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@hmtickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
