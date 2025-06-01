const express = require('express');
const cors = require('cors');
const app = express();
const ticketRoutes = require('./routes/tickets');

app.use(cors());
app.use(express.json());
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});