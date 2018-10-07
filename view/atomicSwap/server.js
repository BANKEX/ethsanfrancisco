const express = require('express');
const app = express();

app.use('/swap', express.static(__dirname + '/'));

app.listen(3003);