require('dotenv').config();
const express = require('express');
const app = new express();
const cors = require('cors');
const helmet = require('helmet');
const apiRouter = require('./routes/api');
const { route } = require('./routes/api');
require('./db'); 

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api', apiRouter);

// SERVER PORT
const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => {
    console.log(`Web server running on http://localhost:${SERVER_PORT}`);
});
