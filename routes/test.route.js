const { Router } = require('express');

const router = Router();

router.get('/:testId', (req, res) => { 
    console.log(req);
    res.json({ testId: req.params.testId });
})

module.exports = router;
