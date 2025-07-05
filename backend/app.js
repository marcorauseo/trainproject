const express = require('express');
const cors = require('cors');
const app = express();
const ticketRoutes = require('./routes/tickets');
const path = require('path');
const publicRoutes = require('./routes/public');
const reportRoutes = require('./routes/report');
const opsRoutes = require('./routes/ops');
const errorHandler = require('./middleware/error');


const authRoutes = require('./routes/auth');
require('dotenv').config();


console.log('🚀 Server starting…');
app.use(cors());
app.use(express.json());



// Servire i file statici dalla directory 'frontend/public'
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));


app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/ops', opsRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});


app.use(errorHandler);
