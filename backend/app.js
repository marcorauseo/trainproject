const express = require('express');
const cors = require('cors');
const app = express();
const ticketRoutes = require('./routes/tickets');
const path = require('path');

const authRoutes = require('./routes/auth');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Servire i file statici dalla directory 'public'
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

