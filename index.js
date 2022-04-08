const express = require('express');
const config = require('config');
const cors = require('cors');
const mongoose = require('mongoose');
const env = require('dotenv');

const app = express();

const authMiddleWare = require('./middlewares/auth');
const mainRouter = require('./routes/index');

env.config();

const port = process.env.PORT || config.get('PORT');
const dbUser = proccess.env.DB_USER;
const dbPass = proccess.env.DB_PWD;
const dbHost = proccess.env.DB_HOST;
const dbBase = proccess.env.DB_BASE;

app.use(express.json())
app.use(cors());
app.options('*', cors());

app.use(authMiddleWare);

app.use('/api', mainRouter);

app.use((err, res, _next) => {
    res.sendStatus(500).json({ error: 'Internal server error' });
});

app.listen(port, async (err) => {
    if (err) {
        return console.error(err)
    }
    try {
        await mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:27017/${dbBase}?authSource=admin`);
        console.log('API started at port', port);
    } catch (dbError) {
        console.log('Error db connection', dbError);
    }
});
