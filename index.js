const express = require('express');
const config = require('config');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const mainRouter = require('./routes/index');

const port = process.env.PORT || config.get('PORT');

app.use(express.json())
app.use(cors());
app.options('*', cors());

app.use('/api', mainRouter)

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
 })