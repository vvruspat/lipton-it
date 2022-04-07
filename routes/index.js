const { Router } = require('express');
const testRouter = require('./test.route');
const questionsRouter = require('./questions.route');
const resultsRouter = require('./results.route');

const router = Router();

router.use('/test', testRouter);
router.use('/questions', questionsRouter);
router.use('/results', resultsRouter);

module.exports = router;