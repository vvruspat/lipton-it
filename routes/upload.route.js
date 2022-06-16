const { Router } = require('express');
const multer = require('multer');
const upload = require('../middlewares/upload');

const router = Router();

const uploader = upload.array('images', 10)

router.post('/upload', async (req, res) => {
    uploader(req, res, (err) => { 
        if (err instanceof multer.MulterError) {
            return res.status(403).json({
                error: err.code,
            })
        } else if (err) { 
            return res.status(401).json({
                error: 'An error occurred while uploading files'
            })
        }

        const images = req.files.map((file) => `https://lipton-it.vkpay.prod.kapps.vk-apps.ru/images/${file.filename}`);
        res.json({images});
    })
});
 
module.exports = router;