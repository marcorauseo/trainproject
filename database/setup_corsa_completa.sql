
-- ================== RESET TABELLE ==================
TRUNCATE TABLE 
  biglietto,
  traccia_oraria,
  corsa_sub_tratta,
  treno,
  convoglio
RESTART IDENTITY CASCADE;

-- ================== INSERIMENTI COMPLETI ==================
DO $$
DECLARE
  tr1_id INT;
  tr2_id INT;
BEGIN
  -- Convoglio
  INSERT INTO CONVOGLIO (NOME_CONVOGLIO, ID_MATERIALE_ROTABILE, POSIZIONE_NEL_CONVOGLIO)
  VALUES 
    ('Convoglio_2', 3, 1),
    ('Convoglio_2', 4, 2),
    ('Convoglio_2', 6, 3);

  -- Treni
  INSERT INTO TRENO (DATA, CODICE_CORSA, DIREZIONE_CORSA, ID_CONVOGLIO, ID_STAZIONE_PARTENZA, ID_STAZIONE_ARRIVO)
  VALUES 
    ('2025-07-21', 'TR003', 'A', 2, 1, 10)
  RETURNING ID_TRENO INTO tr1_id;

  INSERT INTO TRENO (DATA, CODICE_CORSA, DIREZIONE_CORSA, ID_CONVOGLIO, ID_STAZIONE_PARTENZA, ID_STAZIONE_ARRIVO)
  VALUES 
    ('2025-07-21', 'TR004', 'R', 2, 10, 1)
  RETURNING ID_TRENO INTO tr2_id;

  -- Traccia oraria TR003
  INSERT INTO TRACCIA_ORARIA (ID_STAZIONE, ID_CORSA, ORARIO_PARTENZA, ORARIO_ARRIVO, KM_CUMULATI, VELOCITA)
  VALUES
    (1, tr1_id, '08:00'::TIME, NULL, 0, 50),
    (10, tr1_id, NULL, '09:10'::TIME, 54.68, 50);

  -- Traccia oraria TR004
  INSERT INTO TRACCIA_ORARIA (ID_STAZIONE, ID_CORSA, ORARIO_PARTENZA, ORARIO_ARRIVO, KM_CUMULATI, VELOCITA)
  VALUES
    (10, tr2_id, '10:00'::TIME, NULL, 54.68, 50),
    (1, tr2_id, NULL, '11:10'::TIME, 0, 50);

  -- Biglietti
  INSERT INTO BIGLIETTO (ID_UTENTE, ID_CORSA, ID_ROTABILE, NUM_POSTO, PREZZO, STATO)
  VALUES
    (1, tr1_id, 3, 10, 15.00, 'pagato'),
    (1, tr1_id, 3, 11, 15.00, 'pagato'),
    (1, tr1_id, 4, 12, 15.00, 'pagato'),
    (1, tr2_id, 3, 5, 15.00, 'pagato');
END $$;
