-- Rimozione dell'indice se esiste
DROP INDEX IF EXISTS idx_utente_email;

-- Rimozione del tipo ENUM 'ruolo_enum' se esiste
DROP TYPE IF EXISTS ruolo_enum;

-- Rimozione della tabella 'utente' se esiste
DROP TABLE IF EXISTS utente;

-- Creazione del tipo ENUM per il campo 'ruolo'
CREATE TYPE ruolo_enum AS ENUM ('VIS', 'REG', 'BOA', 'BOE');

-- Creazione della tabella 'utente'
CREATE TABLE utente (
  id_utente SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hash_pwd TEXT NOT NULL,
  cellulare VARCHAR(15),
  data_nascita DATE,
  luogo_nascita TEXT,
  ruolo ruolo_enum NOT NULL
);

-- Creazione dell'indice sulla colonna 'email'
CREATE INDEX idx_utente_email ON utente (email);
