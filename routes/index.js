const { Router } = require('express');
const testRuter = require('./test.route');

const router = Router();

router.use('/test', testRuter);


module.exports = router;