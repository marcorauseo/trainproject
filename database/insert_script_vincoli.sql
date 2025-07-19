
-- Inserimento dati linea turistica
INSERT INTO LINEA (LUNGHEZZA_KM) VALUES (54.68);

-- Stazioni
INSERT INTO STAZIONE (NOME, KM, ID_LINEA) VALUES
  ('Torre Spaventa', 0.000, 1),
  ('Prato Terra', 2.700, 1),
  ('Rocca Pietrosa', 7.580, 1),
  ('Villa Pietrosa', 12.680, 1),
  ('Villa Santa Maria', 16.900, 1),
  ('Pietra Santa Maria', 23.950, 1),
  ('Castro Marino', 31.500, 1),
  ('Porto Spigola', 39.500, 1),
  ('Porto San Felice', 46.000, 1),
  ('Villa San Felice', 54.680, 1);

-- Sub-tratte (solo tratte dirette tra stazioni consecutive)
INSERT INTO SUB_TRATTA (ID_STAZIONE_ORIGINE, ID_STAZIONE_ARRIVO, LUNGHEZZA_KM, VEL_MEDIA_KM) VALUES
  (1, 2, 2.700, 50),
  (2, 3, 4.880, 50),
  (3, 4, 5.100, 50),
  (4, 5, 4.220, 50),
  (5, 6, 7.050, 50),
  (6, 7, 7.550, 50),
  (7, 8, 8.000, 50),
  (8, 9, 6.500, 50),
  (9, 10, 8.680, 50);

-- Tipi materiale rotabile
INSERT INTO TIPO_MATERIALE_ROTABILE (SIGLA_SERIE, CATEGORIA, SEDUTE) VALUES
  ('B1', 'Carrozza 1928', 36),
  ('B2', 'Carrozza 1928', 36),
  ('C6', 'Carrozza 1930', 48),
  ('CD1', 'Bagagliaio 1910', 12),
  ('AN56.2', 'Automotrice', 56),
  ('SFT.3', 'Locomotiva', 0);

-- Materiale rotabile
INSERT INTO MATERIALE_ROTABILE (ID_TIPO_MATERIALE, NUM_POSTO, CODICE_PROGRESSIVO, DATA_MANUTENZIONE) VALUES
  (1, 1, 'B1-001', '2025-01-01'),
  (2, 1, 'B2-001', '2025-01-01'),
  (3, 1, 'C6-001', '2025-01-01'),
  (4, 1, 'CD1-001', '2025-01-01'),
  (5, 1, 'AN56-2-001', '2025-01-01'),
  (6, 1, 'SFT-3', '2025-01-01');

-- Convoglio (es. con 3 elementi)
INSERT INTO CONVOGLIO (NOME_CONVOGLIO, ID_MATERIALE_ROTABILE, POSIZIONE_NEL_CONVOGLIO) VALUES
  ('Convoglio_1', 1, 1),
  ('Convoglio_1', 2, 2),
  ('Convoglio_1', 6, 3);

-- Utenti
INSERT INTO UTENTE (NOME, COGNOME, EMAIL, HASH_PWD, RUOLO) VALUES
  ('Mario', 'Rossi', 'mario@rossi.it', 'hashedpwd1', 'REG'),
  ('Lucia', 'Bianchi', 'lucia@boe.it', 'hashedpwd2', 'BOE'),
  ('Anna', 'Verdi', 'anna@boa.it', 'hashedpwd3', 'BOA');

-- Treno
INSERT INTO TRENO (DATA, CODICE_CORSA, DIREZIONE_CORSA, ID_CONVOGLIO, ID_STAZIONE_PARTENZA, ID_STAZIONE_ARRIVO) VALUES
  ('2025-07-20', 'TR001', 'A', 1, 1, 10),
  ('2025-07-20', 'TR002', 'R', 1, 10, 1);

-- Traccia oraria (solo esempio base)
INSERT INTO TRACCIA_ORARIA (ID_STAZIONE, ID_CORSA, ORARIO_ARRIVO, ORARIO_PARTENZA, KM_CUMULATI, VELOCITA) VALUES
  (1, 1, NULL, '08:00', 0, 50),
  (10, 1, '09:10', NULL, 54.68, 50);

-- Biglietti
INSERT INTO BIGLIETTO (ID_UTENTE, ID_CORSA, ID_ROTABILE, NUM_POSTO, PREZZO, STATO)
VALUES
  (1, 1, 1, 5, 12.50, 'pagato'),
  (1, 1, 2, 6, 12.50, 'pagato'),
  (1, 1, 2, 7, 12.50, 'pagato');
