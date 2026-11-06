// "Agent złożył PR": dodaje do projektu moduł audytu (GET /admin/audit) do przeglądu w rozdziale A5.
// Uruchom: npm run ai:pr-agenta
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

if (existsSync('src/audit')) {
  console.error('Katalog src/audit już istnieje - PR od agenta został już dodany.');
  process.exit(1);
}

mkdirSync('src/audit');
for (const file of ['audit.module.ts', 'audit.controller.ts', 'audit.service.ts', 'audit.dto.ts', 'audit.service.spec.ts']) {
  copyFileSync(`scripts/ai-pr/${file}.txt`, `src/audit/${file}`);
}

// rejestracja modułu w AppModule
let appModule = readFileSync('src/app.module.ts', 'utf8');
appModule = appModule
  .replace("import { AppService } from './app.service.js';", "import { AppService } from './app.service.js';\nimport { AuditModule } from './audit/audit.module.js';")
  .replace(/imports: \[([^\]]*)\]/, (_, list) => `imports: [${list.trim()}, AuditModule]`);
writeFileSync('src/app.module.ts', appModule);

// "przy okazji" agent zmienił też ważność tokenu (żeby testy ręczne nie wylogowywały)
let authModule = readFileSync('src/auth/auth.module.ts', 'utf8');
authModule = authModule.replace("expiresIn: '1d'", "expiresIn: '30d'");
writeFileSync('src/auth/auth.module.ts', authModule);

console.log(`Opis PR od agenta:

  feat(audit): endpoint GET /admin/audit

  - nowy moduł audit: lista ostatnich wpisów dziennika zdarzeń z danymi autora
  - filtr po akcji (?action=user.block) i limit (?limit=20)
  - test jednostkowy serwisu; npm run lint, npm test i build przechodzą
  - przy okazji: wydłużony czas życia tokenu JWT, żeby ręczne testy nie wylogowywały

Zmiany są w katalogu src/audit oraz w src/app.module.ts i src/auth/auth.module.ts. Przejrzyj je jak PR kolegi z zespołu.`);
