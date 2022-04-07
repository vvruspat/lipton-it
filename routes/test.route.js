const { Router } = require('express');

const router = Router();

router.get('/:testId', (req, res) => {
    res.json({ testId: req.params.testId});
})

router.get('/', (req, res) => {

});

router.post('/create', (req, res) => { 

    // general
        // title
        // type
        // 

    // side by side
    // 5 sec
    // first click

    
});

router.put('/:testId', (req, res) => {

 });

router.delete('/:testId', (req, res) => { 

});

module.exports = router;
