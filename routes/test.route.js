const { Router } = require('express');
const Tests = require('../shemas/test.schema');

const router = Router();

router.get('/:testId', async (req, res, next) => {

    try {
        const candidate = await TestModule.findOne({ _id: req.params.testId }).exec();

        if (candidate) { 
            return res.json(candidate)
        }

        res.sendStatus(404).json({error: `test with id ${req.params.testId} not found`})
    } catch (err) { 
        next(err)
    }
})

router.get('/', async (req, res) => {

    const { vk_user_id: userId } = req.app.get('authData');

    try {
        const result = await Tests.find({ userId }).exec();
        
        res.json(result);

    } catch (err) { 
        next(err)
    }

});

router.post('/create', async (req, res, next) => { 

    const { vk_user_id: userId } = req.app.get('authData');
    const { title, testType, status, description } = req.body;

    try {
        const test = new Tests({ title, testType, status, description, userId });
        await test.save()

        res.sendStatus(200)

    } catch (err) { 
        next(err);
    }
});

router.put('/:testId', async (req, res) => {

    const { vk_user_id: userId } = req.app.get('authData');
    const { title, testType, status, description } = req.body;

    try {
        const result = await Tests.findOneAndUpdate({ _id: req.params.testId, userId }, { title, testType, status, description }).exec()

        if(result){
            return res.sendStatus(200)
        }

        res.sendStatus(401).json({error: "Test not found or user does't own it"})
    } catch (err) { 
        next(err)
    }

 });

router.delete('/:testId', async (req, res) => { 

    const { vk_user_id: userId } = req.app.get('authData');

    try {
        const result = await Tests.findById(req.params.testId).exec()

        if (result && result.userId === userId) {
            await Tests.findOneAndRemove({ userId }).exec()
            
            res.sendStatus(200)
        } else { 
            res.sendStatus(401).json({error: "Test not found or user does't own it"})
        }

    } catch (err) { 
        next(err)
    }

});

module.exports = router;
