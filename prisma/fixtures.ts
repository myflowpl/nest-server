// Dane demonstracyjne do seeda (lekcja D3): 50 użytkowników rozrzuconych w czasie. Sama baza nas tu nie interesuje.
import { RoleNames } from '../src/auth/auth.types.js';

const NAMES = ['Anna', 'Piotr', 'Marta', 'Jan', 'Ewa', 'Tomasz', 'Kasia', 'Michał', 'Zofia', 'Adam'];
const SURNAMES = ['Nowak', 'Kowalski', 'Wiśniewska', 'Wójcik', 'Kamińska'];
const DAY = 24 * 60 * 60 * 1000;

export interface DemoUser {
  email: string;
  displayName: string;
  role: RoleNames;
  createdAt: Date;
}

/** user01@example.com ... user50@example.com (hasło: password123); co ósmy jest administratorem. */
export function demoUsers(count = 50): DemoUser[] {
  return Array.from({ length: count }, (_, index) => {
    const i = index + 1;
    return {
      email: `user${String(i).padStart(2, '0')}@example.com`,
      displayName: `${NAMES[i % NAMES.length]} ${SURNAMES[i % SURNAMES.length]}`,
      role: i % 8 === 0 ? RoleNames.ADMIN : RoleNames.USER,
      createdAt: new Date(Date.now() - i * DAY), // i dni temu
    };
  });
}
