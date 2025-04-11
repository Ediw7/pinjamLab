const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));

const routes = require('./routes/index');
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
