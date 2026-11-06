import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaExceptionFilter } from './prisma-exception.filter.js';

describe('PrismaExceptionFilter', () => {
  const filter = new PrismaExceptionFilter();

  // atrapa odpowiedzi Express: res.status(...).json(...)
  function run(code: string) {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const host = { switchToHttp: () => ({ getResponse: () => ({ status }) }) } as unknown as ArgumentsHost;
    filter.catch(new Prisma.PrismaClientKnownRequestError('błąd bazy', { code, clientVersion: 'test' }), host);
    return { status, json };
  }

  it.each([
    ['P2002', HttpStatus.CONFLICT],
    ['P2025', HttpStatus.NOT_FOUND],
    ['P2003', HttpStatus.CONFLICT],
    ['P9999', HttpStatus.INTERNAL_SERVER_ERROR],
  ])('kod %s zamienia na status %i', (code, expected) => {
    const { status, json } = run(code);

    expect(status).toHaveBeenCalledWith(expected);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: expected, error: code }));
  });
});
