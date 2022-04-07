const { Router } = require('express');
const testRouter = require('./test.route');
const questionsRouter = require('./questions.route');

const router = Router();

router.use('/test', testRouter);
router.use('/questions', questionsRouter);

module.exports = router;