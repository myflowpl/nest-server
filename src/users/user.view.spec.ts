import { UserStatus } from '../generated/prisma/client.js';
import { toUserView, UserWithRelations } from './user.view.js';

describe('toUserView', () => {
  const createdAt = new Date('2026-01-01T10:00:00Z');

  // rekord w takim kształcie, w jakim zwraca go Prisma (z userSelect)
  const record: UserWithRelations = {
    id: 1,
    email: 'ala@example.com',
    createdAt,
    status: UserStatus.ACTIVE,
    profile: { displayName: 'Ala' },
    roles: [{ role: { name: 'admin' } }, { role: { name: 'user' } }],
  };

  it('zamienia rekord z bazy na widok API', () => {
    expect(toUserView(record)).toEqual({
      id: 1,
      email: 'ala@example.com',
      displayName: 'Ala',
      roles: ['admin', 'user'],
      status: 'ACTIVE',
      createdAt,
    });
  });

  it('bez profilu displayName jest null', () => {
    expect(toUserView({ ...record, profile: null }).displayName).toBeNull();
  });
});
