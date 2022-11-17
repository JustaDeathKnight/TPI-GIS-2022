const express = require('express');

const app = express();

const helmet = require('helmet');

app.use(helmet());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

module.exports = app;