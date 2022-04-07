const express = require('express');
const config = require('config');
const cors = require('cors');
const mongoose = require('mongoose');
const env = require('dotenv');
const qs = require('querystring');
const crypto = require('crypto');
const mainRouter = require('./routes/index');

const port = process.env.PORT || config.get('PORT');
const app = express();
env.config();

app.use(express.json())
app.use(cors());
app.options('*', cors());

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

app.listen(port, async (err) => {
    if (err) {
        return console.error(err)
    }
    try {
        await mongoose.connect(`mongodb://dev:devsecret@45.8.249.80:27017/dev?authSource=admin`);
        console.log('API started at port', port);
    } catch (dbError) {
        console.log('Error db connection', dbError)
    }
});
