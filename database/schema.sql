CREATE TABLE utente (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  email TEXT UNIQUE
);

CREATE TABLE tratta (
  id SERIAL PRIMARY KEY,
  treno TEXT,
  stazione_partenza TEXT,
  stazione_arrivo TEXT,
  orario_partenza TIME,
  orario_arrivo TIME
);

CREATE TABLE biglietto (
  id SERIAL PRIMARY KEY,
  utente_id INTEGER REFERENCES utente(id),
  tratta_id INTEGER REFERENCES tratta(id),
  data_acquisto TIMESTAMP,
  posto TEXT
);