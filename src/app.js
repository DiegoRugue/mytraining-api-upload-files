const express = require('express');
const fs = require('fs');
const { join } = require('path');
const uuid = require('uuid/v4');

const app = express();

app.use(express.json());

const path = join(process.cwd(), 'uploads');

fs.exists(path, exists => {
    if (exists) return;

    fs.mkdir(path, err => {
        if (err) throw err;

        return;
    });
});

app.get('/ping', (req, res) => {
    res.json({ ping: new Date() });
});

app.post('/file', async (req, res) => {
    let file = req.body.file;

    if (file.includes(';base64,')) {
        file = file.split(';base64,').pop();
    }

    const convertedFile = Buffer.from(file, 'base64');
    const filename = `${uuid()}-${Date.now()}.png`;

    fs.writeFile(join(path, filename), convertedFile, err => {
        if (err) res.json({ error: err });

        res.send(filename);
    });
});

app.use(express.static(path));

module.exports = app;