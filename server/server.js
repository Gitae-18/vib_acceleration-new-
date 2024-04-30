'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;
app.post('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
app.get('/', (req, res) => {
    console.log('success');
    res.send('Hello, this is the root path!');
});
app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
