const multer = require('multer');
const md5 = require('md5')
const { GridFsStorage } = require('multer-gridfs-storage');

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PWD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;

const storage = new GridFsStorage({
    url: `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`,
    file: (req, file) => { 
        return {
            bucketName: 'images',
            filename: `${md5(Date.now() + '_' + file.originalname)}`
        }
    }
})

module.exports = multer({storage, fileFilter: (req, file, callback) => {
    const match = ['image/png', 'image/jpeg', 'images/webp'];
    if (!match.includes(file.mimetype)) {
        return callback(new multer.MulterError('Only images are allowed'))
    }
       
    callback(null, true)
}})