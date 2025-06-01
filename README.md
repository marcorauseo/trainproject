# TreniApp

Applicazione web per la gestione delle tratte ferroviarie e l'acquisto dei biglietti.

## Tecnologie

- Frontend: HTML + CSS + JS
- Backend: Node.js + Express
- Database: PostgreSQL (consigliato Supabase)

## Avvio locale

1. Clona la repo
2. `cd backend && npm install`
3. Crea file `.env` con la variabile DATABASE_URL
4. `node app.js`
5. Apri `frontend/index.html` in browser

## API

- `GET /api/tickets/routes`: lista tratte
- `POST /api/tickets/buy`: acquista biglietto