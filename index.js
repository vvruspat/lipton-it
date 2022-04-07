const express = require('express');
const config = require('config')
const app = express();
const mainRouter = require('./routes/index')

const port = process.env.PORT || config.get('PORT');

app.use('/api', mainRouter)

app.listen(port, (err) => {
    if (err) { 
        console.error(err)
    }

    console.log('API started at port', port);
 })