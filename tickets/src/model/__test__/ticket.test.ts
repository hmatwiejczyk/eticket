import { Ticket } from '../ticket';

test('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    userId: '123',
    price: 10,
    title: 'concert',
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  await firstInstance?.save();
  try {
    await secondInstance?.save();
  } catch (err) {
    return done();
  }
  throw new Error('should not reach this point');
});

test('increment version number on multiple saves', async () => {
  const ticket = Ticket.build({
    userId: '123',
    price: 10,
    title: 'concert',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
