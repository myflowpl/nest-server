import { UserStatus } from '../generated/prisma/client.js';
import { RoleNames } from '../auth/auth.types.js';
import { UserView } from './user.view.js';
import { escapeCsvField, usersToCsv } from './users-csv.js';

const view = (patch: Partial<UserView> = {}): UserView => ({
  id: 1,
  email: 'ala@example.com',
  displayName: 'Ala',
  roles: [RoleNames.USER],
  status: UserStatus.ACTIVE,
  createdAt: new Date('2026-01-01T10:00:00Z'),
  ...patch,
});

describe('escapeCsvField', () => {
  it('zwykłe pole zostawia bez zmian', () => {
    expect(escapeCsvField('Ala')).toBe('Ala');
  });

  it.each(['=', '+', '-', '@', '\t', '\r'])('pole zaczynające się od %j dostaje apostrof', (char) => {
    const result = escapeCsvField(`${char}x`);
    expect(result.replace(/^"/, '').startsWith(`'${char}`)).toBe(true);
  });

  it('znak niebezpieczny w środku pola nie dostaje apostrofu', () => {
    expect(escapeCsvField('a=b')).toBe('a=b');
  });

  it('pole z przecinkiem, cudzysłowem lub nową linią ujmuje w cudzysłów', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"');
    expect(escapeCsvField('a"b')).toBe('"a""b"');
    expect(escapeCsvField('a\nb')).toBe('"a\nb"');
    expect(escapeCsvField('a\rb')).toBe('"a\rb"');
  });

  it('najpierw apostrof, potem cudzysłów', () => {
    expect(escapeCsvField('=a,b')).toBe(`"'=a,b"`);
    expect(escapeCsvField('-"x"')).toBe(`"'-""x"""`);
  });
});

describe('usersToCsv', () => {
  it('pusta lista daje sam nagłówek', () => {
    expect(usersToCsv([])).toBe('id,email,displayName,status,createdAt');
  });

  it('jeden wiersz na użytkownika, rozdzielone \\n, bez końcowego \\n', () => {
    const csv = usersToCsv([view(), view({ id: 2, email: 'ola@example.com', displayName: 'Ola', status: UserStatus.BLOCKED })]);
    expect(csv).toBe(
      [
        'id,email,displayName,status,createdAt',
        '1,ala@example.com,Ala,ACTIVE,2026-01-01T10:00:00.000Z',
        '2,ola@example.com,Ola,BLOCKED,2026-01-01T10:00:00.000Z',
      ].join('\n'),
    );
    expect(csv).not.toContain('\r\n');
  });

  it('brak nazwy wyświetlanej daje puste pole', () => {
    expect(usersToCsv([view({ displayName: null })]).split('\n')[1]).toBe('1,ala@example.com,,ACTIVE,2026-01-01T10:00:00.000Z');
  });

  it('zabezpiecza pola z danymi użytkownika', () => {
    const line = usersToCsv([view({ displayName: '=HYPERLINK("x")' })]).split('\n')[1];
    expect(line).toContain(`"'=HYPERLINK(""x"")"`);
  });

  it('nie zawiera hasła ani ról', () => {
    const csv = usersToCsv([Object.assign(view(), { passwordHash: 'tajne' })]);
    expect(csv).not.toContain('tajne');
    expect(csv).not.toContain('passwordHash');
  });

  it('nie zaczyna się od BOM', () => {
    expect(usersToCsv([]).charCodeAt(0)).not.toBe(0xfeff);
  });
});
