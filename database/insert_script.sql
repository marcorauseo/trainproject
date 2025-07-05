/* =======================================================================
   POPOLAMENTO MINIMO PER TEST ACQUISTO BIGLIETTO
   ======================================================================= */

TRUNCATE LINEE, STAZIONE, SUB_TRATTA, TIPO_MATERIALE_ROTABILE,
         MATERIALE_ROTABILE, CONVOGLIO, TRENO, CORSA_SUB_TRATTA,
         TRACCIA_ORARIA, UTENTE, BIGLIETTO RESTART IDENTITY CASCADE;    

/* ---------- LINEA ----------------------------------------------------- */
INSERT INTO LINEE (LUNGHEZZA_KM) VALUES (600) RETURNING ID_LINEA;
-- supponiamo ritorni 1

/* ---------- STAZIONI -------------------------------------------------- */
INSERT INTO STAZIONE (NOME, KM, ID_LINEA) VALUES
  ('ROMA',     0,   1),
  ('FIRENZE', 230,  1),
  ('BOLOGNA', 370,  1),
  ('MILANO',  600,  1)
RETURNING ID_STAZIONE;   -- 1..4

/* ---------- SUB_TRATTE (Roma-Mi via Fi-Bo) ---------------------------- */
INSERT INTO SUB_TRATTA
  (ID_STAZIONE_ORIGINE, ID_STAZIONE_ARRIVO, LUNGHEZZA_KM, VEL_MEDIA_KM)
VALUES
  (1, 2, 230, 160),   -- Roma-Firenze
  (2, 3, 140, 150),   -- Firenze-Bologna
  (3, 4, 230, 170);   -- Bologna-Milano

/* ---------- TIPO & MATERIALE ROTABILE -------------------------------- */
INSERT INTO TIPO_MATERIALE_ROTABILE (SIGLA_SERIE, CATEGORIA, SEDUTE)
VALUES ('E444', 'Locomotiva + carrozze', 80) RETURNING ID_TIPO; -- 1

INSERT INTO MATERIALE_ROTABILE
  (ID_TIPO_MATERIALE, NUM_POSTO, CODICE_PROGRESSIVO, DATA_MANUTENZIONE)
VALUES
  (1, NULL, 'E444-001', '2025-05-01')
RETURNING ID_MATERIALE;   -- 1

/* ---------- CONVOGLIO ------------------------------------------------ */
INSERT INTO CONVOGLIO
  (NOME_CONVOGLIO, ID_MATERIALE_ROTABILE, POSIZIONE_NEL_CONVOGLIO)
VALUES ('FrecceBlu 01', 1, 1) RETURNING ID_CONVOGLIO;  -- 1

/* ---------- TRENO / CORSA DI OGGI ------------------------------------ */
INSERT INTO TRENO
  (DATA, CODICE_CORSA, DIREZIONE_CORSA, ID_CONVOGLIO,
   ID_STAZIONE_PARTENZA, ID_STAZIONE_ARRIVO)
VALUES
  (CURRENT_DATE, 'RB100', 'NORD', 1, 1, 4)
RETURNING ID_TRENO;          -- 1

/* ---------- CORSA_SUB_TRATTA ---------------------------------------- */
-- orari semplificati: parte 08:00 Roma, arr 12:15 Milano
INSERT INTO CORSA_SUB_TRATTA
  (ID_TRENO, ID_SUB_TRATTA, T_START, T_END, DIREZIONE)
VALUES
  (1, 1, '08:00', '09:30', 'NORD'),
  (1, 2, '09:30', '10:45', 'NORD'),
  (1, 3, '10:45', '12:15', 'NORD');

/* ---------- TRACCIA_ORARIA (arr/part singole stazioni) --------------- */
INSERT INTO TRACCIA_ORARIA
  (ID_STAZIONE, ID_CORSA, ORARIO_ARRIVO, ORARIO_PARTENZA, KM_CUMULATI, VELOCITA)
VALUES
  (1, 1, NULL,   '08:00', 0,   0),      -- Roma part.
  (2, 1, '09:30','09:35', 230, 160),
  (3, 1, '10:45','10:50', 370, 150),
  (4, 1, '12:15', NULL,   600, 170);    -- Milano arr.

/* ---------- UTENTE REG DI TEST --------------------------------------- */
/* hash generato con bcrypt(10) per 'password123' */
INSERT INTO UTENTE
  (NOME, COGNOME, EMAIL, HASH_PWD, RUOLO)
VALUES
  ('Mario', 'Rossi', 'mario@example.com',
   '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36glD/Si1eZ2/7Nr9wxSmK',   -- password123
   'REG');
