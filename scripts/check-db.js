// Sprawdza, czy baza PostgreSQL z docker compose jest dostępna z Node.js.
// Uruchom: npm run db:check
import pg from 'pg';

const DEFAULT_URL = 'postgresql://nest:nest@localhost:5432/nest';
const url = process.env.DATABASE_URL ?? DEFAULT_URL;

if (!/^postgres(ql)?:\/\//.test(url)) {
  console.error(`❌ DATABASE_URL w pliku .env nie wskazuje na PostgreSQL: ${url}`);
  console.error(`   Usuń plik .env albo ustaw w nim: DATABASE_URL="${DEFAULT_URL}"`);
  process.exit(1);
}

// Świeżo uruchomiony kontener potrzebuje kilku sekund, zanim przyjmie połączenia.
const RETRY_CODES = new Set(['ECONNREFUSED', 'ECONNRESET', '57P03']);
const MAX_ATTEMPTS = 10;

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    const { rows } = await client.query('SELECT version()');
    console.log('✅ Połączenie z bazą działa');
    console.log(`   ${rows[0].version}`);
    break;
  } catch (error) {
    if (RETRY_CODES.has(error.code) && attempt < MAX_ATTEMPTS) {
      if (attempt === 1) console.log('⏳ Czekam, aż baza wystartuje...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }
    console.error('❌ Brak połączenia z bazą:', error.message || error.code);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Czy Docker i kontener działają? Uruchom: docker compose up -d');
    } else if (error.code === '28P01') {
      console.error('   Złe hasło – sprawdź DATABASE_URL i POSTGRES_PASSWORD w pliku .env');
    }
    process.exitCode = 1;
    break;
  } finally {
    await client.end().catch(() => {});
  }
}
