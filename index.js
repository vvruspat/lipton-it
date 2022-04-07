const express = require('express');
const config = require('config');
const env = require('dotenv');
const qs = require('querystring');
const crypto = require('crypto');
const app = express();
const mainRouter = require('./routes/index');

env.config();

const port = process.env.PORT || config.get('PORT');

app.use((req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (header) {
            const authData = JSON.parse(header);
            const ordered = {};

            Object.keys(authData).sort().forEach((key) => {
                if (key.slice(0, 3) === 'vk_') {
                    ordered[key] = authData[key];
                }
            });

            const stringParams = qs.stringify(ordered);
            const paramsHash = crypto
                .createHmac('sha256', process.env.VK_SECRET_KEY)
                .update(stringParams)
                .digest()
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=$/, '');

            if (paramsHash === authData.sign) {
                next();
            } else {
                res.status(403).json({ error: 'Bad sign' });
            }

        } else {
            res.status(403).json({ error: 'Bad auth header' });
        }

    } catch (e) {
        res.status(500).json({ error: 'Server error', message: e.message });
    }
});

app.use('/api', mainRouter);

app.listen(port, (err) => {
    if (err) { 
        console.error(err)
    }

    console.log('API started at port', port);
});