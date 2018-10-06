const express = require('express');
const path = require('path');
const app = express();

app.use('/send', express.static(__dirname + '/'));

app.listen(3002);