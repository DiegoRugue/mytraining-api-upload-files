const express = require('express');
const fs = require('fs');
const { join } = require('path');
const uuid = require('uuid/v4');

const app = express();

app.use(express.json());

fs.exists(join(process.cwd(), 'uploads'), exists => {
    if (exists) return;

    fs.mkdir(join(process.cwd(), 'uploads'), err => {
        if (err) throw err;

        return;
    });
});

app.post('/file', async (req, res) => {
    let file = req.body.file;

    if (file.includes(';base64,')) {
        file = file.split(';base64,').pop();
    }

    const convertedFile = Buffer.from(file, 'base64');

    const path = join(process.cwd(), 'uploads');

    const filename = `${uuid()}-${Date.now()}.png`;

    fs.writeFile(join(path, filename), convertedFile, err => {
        if (err) res.json({ error: err });

        res.json({ path: filename });
    });
});

app.use(express.static(join(process.cwd(), 'uploads')));

module.exports = app;