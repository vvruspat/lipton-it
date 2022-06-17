const mongoose = require('mongoose')
const Grid = require('gridfs-stream');

const COLLECTION = 'images';

const getGfs = () => {
    const conn = mongoose.connection;

    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection(COLLECTION)
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: COLLECTION
    })

    return {gfs, gridfsBucket}
}

module.exports = getGfs