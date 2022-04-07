const express = require('express');
const config = require('config')
const app = express();

const port = config.get('PORT');

app.listen(port, (err) => {
    if (err) { 
        console.error(err)
    }

    console.log('API started at port', port);
 })