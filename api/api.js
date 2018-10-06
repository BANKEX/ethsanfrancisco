const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const handlers = require('./handlers/handlers');

app.use(cors());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

app.put('/create/:guid', async (req, res) => handlers.createAccount(req, res));
app.post('/transaction/:guid', async (req, res) => handlers.createTransaction(req, res));
app.get('/transaction/:guid', async (req, res) => handlers.getTransaction(req, res));
app.get('/guid/lifetime/:guid', async (req, res) => handlers.getGuidLifetime(req, res));

app.listen(3000, () => {
    console.log('API listening 3000 port')
})