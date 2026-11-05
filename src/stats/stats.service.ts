import { Injectable, NotImplementedException } from '@nestjs/common';

/** Szkielet serwisu: trasa już działa, ale zwraca 501. Raporty zaimplementujesz w lekcji D6. */
@Injectable()
export class StatsService {
  overview(): Promise<unknown> {
    throw new NotImplementedException('Statystyki zaimplementujesz w lekcji D6');
  }
}
