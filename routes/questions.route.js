const { Router } = require('express');

const router = Router();

/**
 * Returns questions for test
 */
router.get('/:testId', (req, res) => { 
    res.json({ testId: req.params.testId});
})

/**
 * Remove questions
 */
router.delete('/:questionId', (req, res) => {
    res.json({ testId: req.params.testId});
})


/**
 * Answer
 */
router.post('/:questionId', (req, res) => {
    const { data } = req.body.data;
    const { questionId } = req.params.questionId;

    res.json({ testId: req.params.testId});
})

module.exports = router;
