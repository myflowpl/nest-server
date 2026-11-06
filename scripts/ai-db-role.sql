-- Uprawnienia roli agent_ro: agent AI czyta dane, ale nie zapisuje i nie widzi haseł.
-- Rolę (LOGIN + hasło z .env) tworzy scripts/ai-db-role.mjs, a ten plik ustawia jej uprawnienia.

-- zaczynamy od zera, więc ponowne uruchomienie zawsze daje ten sam wynik
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM agent_ro;
REVOKE ALL ON SCHEMA public FROM agent_ro;

DO $$ BEGIN
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO agent_ro', current_database());
END $$;
GRANT USAGE ON SCHEMA public TO agent_ro;

-- tabele bez wrażliwych danych: cały odczyt
GRANT SELECT ON "Profile", "Role", "UserRole", "AuditLog" TO agent_ro;

-- User: odczyt wybranych kolumn, bez passwordHash
GRANT SELECT ("id", "email", "createdAt", "updatedAt", "status", "lastLoginAt") ON "User" TO agent_ro;

-- zabezpieczenia na poziomie samej roli: transakcje tylko do odczytu i limit czasu zapytania
ALTER ROLE agent_ro SET default_transaction_read_only = on;
ALTER ROLE agent_ro SET statement_timeout = '5s';
