const express = require('express');
const path = require('path');
const app = express();

app.use('/create', express.static(__dirname + '/'));

app.listen(3001);