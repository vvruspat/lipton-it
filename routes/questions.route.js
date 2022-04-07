const { Router } = require('express');
const Questions = require('../shemas/questions.schema');

const router = Router();

/**
 * Remove question
 */
router.delete('/:questionId', async (req, res, next) => {

    try {
        await Questions.findByIdAndRemove(req.params.questionId).exec();

        res.json({ success: true });
    } catch (e) {
        next(e);
    }

})

module.exports = router;
