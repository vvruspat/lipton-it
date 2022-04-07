const { Router } = require('express');

const router = Router();

router.get('/:testId', (req, res) => { 
    res.json({ testId: req.params.testId });
})

module.exports = router;
