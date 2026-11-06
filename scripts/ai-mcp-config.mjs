// Generuje dbhub.toml: konfigurację serwera MCP DBHub z rolą agent_ro (tylko odczyt).
// Plik zawiera hasło, więc jest w .gitignore. Uruchom: npm run ai:mcp-config
import { writeFileSync } from 'node:fs';

const password = process.env.AGENT_DB_PASSWORD;
if (!password || !process.env.DATABASE_URL) {
  console.error('Brak AGENT_DB_PASSWORD lub DATABASE_URL w .env.');
  process.exit(1);
}

const url = new URL(process.env.DATABASE_URL);
url.username = 'agent_ro';
url.password = password;

writeFileSync(
  'dbhub.toml',
  `# Konfiguracja serwera MCP DBHub (wygenerowana przez npm run ai:mcp-config; zawiera hasło, nie wersjonujemy)
[[sources]]
id = "nest"
dsn = "${url.toString()}"

[[tools]]
name = "execute_sql"
source = "nest"
readonly = true
max_rows = 200
`,
);
console.log('Zapisano dbhub.toml (połączenie jako agent_ro, tylko odczyt, maks. 200 wierszy).');
