const { Router } = require('express');
const testRouter = require('./test.route');
const questionsRouter = require('./questions.route');
const resultsRouter = require('./results.route');
const healthcheckRouter = require('./healthcheck.route');
const uploadRouter = require('./upload.route');

const router = Router();

router.use('/test', testRouter);
router.use('/questions', questionsRouter);
router.use('/results', resultsRouter);
router.use('/healthcheck', healthcheckRouter);
router.use('/file', uploadRouter);

module.exports = router;