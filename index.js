const env = require('dotenv');
env.config();

const express = require('express');
const config = require('config');
const cors = require('cors');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

const app = express();

const authMiddleWare = require('./middlewares/auth');
const mainRouter = require('./routes/index');

const port = process.env.PORT || config.get('PORT');
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PWD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;

const conn = mongoose.connection;
let gfs, gridfsBucket;

conn.once('open', () => { 
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
         bucketName: 'images'
    })
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('images')
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.options('*', cors());

app.use(authMiddleWare);

app.use('/api', mainRouter);
app.use('/images/:filename', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file) { 
            return res.sendStatus(404);
        }

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (err) { 
        res.sendStatus(404)
    }
    
 })

app.use((err, res, _next) => {
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, async (err) => {
    if (err) {
        return console.error(err)
    }
    try {
        await mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`);
        console.log('API started at port', port);
    } catch (dbError) {
        console.log('Error db connection', dbError);
    }
});
