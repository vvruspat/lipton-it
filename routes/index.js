const { Router } = require('express');
const testRuter = require('./test.route');
const resultsRuter = require('./results.route');

const router = Router();

router.use('/test', testRuter);
router.use('/results', resultsRuter);


module.exports = router;