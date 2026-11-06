import { UserView } from './user.view.js';

const HEADER = ['id', 'email', 'displayName', 'status', 'createdAt'];

/** Pole CSV: apostrof przed znakiem formuły Excela, potem cudzysłów, gdy pole ma przecinek, cudzysłów lub nową linię. */
export function escapeCsvField(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

/** Zamienia widoki użytkowników na CSV (wiersze rozdzielone `\n`, bez końcowego `\n`). */
export function usersToCsv(users: UserView[]): string {
  const rows = users.map((user) =>
    [user.id, user.email, user.displayName ?? '', user.status, user.createdAt.toISOString()]
      .map((field) => escapeCsvField(String(field)))
      .join(','),
  );
  return [HEADER.join(','), ...rows].join('\n');
}
