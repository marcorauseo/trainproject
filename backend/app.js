
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
console.log('🚀 Server starting…');
const cors = require('cors');


// ✅ Middleware prima delle route
app.use(cors());
app.use(express.json()); // << Questo deve venire prima di tutte le route

// ✅ Rotte API
app.use('/api/paysteam', require('./routes/paysteamHook'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/public', require('./routes/public'));
app.use('/api/report', require('./routes/report'));
app.use('/api/ops', require('./routes/ops'));
app.use('/api', require('./routes/boa'));
app.use('/api/boe', require('./routes/boe'));
app.use('/api', require('./routes/boe'));
app.use(cors());




// ✅ Static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// ✅ Gestione errori
const errorHandler = require('./middleware/error');
app.use(errorHandler);

// ✅ Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
