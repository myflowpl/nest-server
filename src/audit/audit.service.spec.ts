import { AuditService } from './audit.service.js';

describe('AuditService', () => {
  it('zwraca wpisy audytu', async () => {
    const prisma = { $queryRawUnsafe: vi.fn().mockResolvedValue([{ id: 1, action: 'user.block' }]) };
    const service = new AuditService(prisma as never);

    const result = await service.list({});

    expect(result).toBeDefined();
    expect(prisma.$queryRawUnsafe).toHaveBeenCalled();
  });
});
