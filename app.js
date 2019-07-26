const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, nex) => {
    res.send('Hello Aditya!!!');
});
app.listen(3000);