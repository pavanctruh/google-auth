process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
require('./models/dbConnection');
const authRouter = require('./routes/authRouter');
const cors = require('cors');
const axios = require('axios');


app.use(cors({
    origin: true,
    credentials: true
}));


app.use(express.json());

app.post('/test', (req, res) => {
  console.log('Test route req.body:', req.body);
  res.json({ message: 'Test route received', body: req.body });
});


app.get('/auth/google', (req, res) => {
    res.send('Hello from auth server');
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
