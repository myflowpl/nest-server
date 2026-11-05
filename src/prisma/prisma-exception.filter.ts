import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';

/** Zamienia znane błędy Prismy na odpowiedzi HTTP (zamiast 500). */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res: Response = host.switchToHttp().getResponse();

    const { status, message } = this.map(exception);
    res.status(status).json({ statusCode: status, error: exception.code, message });
  }

  private map(e: Prisma.PrismaClientKnownRequestError): { status: number; message: string } {
    switch (e.code) {
      case 'P2002': // naruszenie unikalności
        return { status: HttpStatus.CONFLICT, message: `Rekord już istnieje (${this.constraint(e)})` };
      case 'P2025': // nie znaleziono rekordu
        return { status: HttpStatus.NOT_FOUND, message: 'Rekord nie został znaleziony' };
      case 'P2003': // naruszenie klucza obcego
        return { status: HttpStatus.CONFLICT, message: 'Rekord jest powiązany z innymi danymi' };
      default:
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: `Błąd bazy danych (${e.code})` };
    }
  }

  /** Z adapterem `pg` nazwa ograniczenia (np. User_email_key) jest w meta.driverAdapterError. */
  private constraint(e: Prisma.PrismaClientKnownRequestError): string {
    type AdapterMeta = { driverAdapterError?: { cause?: { constraint?: { index?: string; fields?: string[] } } } };
    const constraint = (e.meta as AdapterMeta | undefined)?.driverAdapterError?.cause?.constraint;
    return constraint?.index ?? constraint?.fields?.join(', ') ?? 'unikalne pole';
  }
}
