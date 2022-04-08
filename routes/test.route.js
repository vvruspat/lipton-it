const { Router } = require('express');
const Tests = require('../shemas/test.schema');
const Questions = require('../shemas/questions.schema');

const router = Router();

/**
 * All active tests
 */
router.get('/', async (req, res, next) => {

    const { vk_user_id: userId } = req.app.get('authData');

    try {
        const result = await Tests.find({ status: 'available' }).exec();

        const resultToSend = result.map((res) => { 
            const resultObj = res.toObject()
            if (resultObj.userPassedIds.includes(userId)) { 
                delete resultObj.userPassedIds;

                return {...resultObj, completed: true, status: 'completed'}
            }

            delete resultObj.userPassedIds;
            
            return resultObj

        })

        res.json(resultToSend);

    } catch (err) {
        next(err)
    }

});

/**
 * All passed tests
 */
router.get('/history', async (req, res, next) => {

    try {
        const result = await Tests.find({ status: { $ne: 'available' } }).exec();

        const resultToSend = result.map((res) => { 
            const resObject = res.toObject();

            delete resObject.userPassedIds

            return resObject
        })

        res.json(resultToSend);

    } catch (err) {
        next(err)
    }

});

/**
 * Only mine tests
 */
router.get('/my', async (req, res, next) => {

    const { vk_user_id: userId } = req.app.get('authData');

    try {
        const result = await Tests.find({ userId }).exec();

        const resultToSend = result.map((res) => { 

            const resObj = res.toObject();

            delete resObj.userPassedIds
            
            return {...resObj, counter: res.userPassedIds?.length ?? 0}
        })

        res.json(resultToSend);

    } catch (err) {
        next(err)
    }

});

/**
 * Create test with questions
 */
router.post('/', async (req, res, next) => {

    const { vk_user_id: userId } = req.app.get('authData');
    const { title, testType, status, description, questions } = req.body;

    try {
        const test = new Tests({ title, testType, status, description, userId, createdAt: new Date().toISOString() });
        await test.save()

        await Questions.insertMany(questions?.map((question) => ({
            ...question,
            testId: test._id
        })));

        res.sendStatus(200);

    } catch (err) { 
        next(err);
    }
});

router.put('/:testId', async (req, res, next) => {

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

router.delete('/:testId', async (req, res, next) => {

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

router.get('/:testId', async (req, res, next) => {

    const { vk_user_id: userId } = req.app.get('authData');

    try {
        const candidate = await Tests.findOne({ _id: req.params.testId }).exec();

        if (candidate) {
            const questions = await Questions.find({ testId: candidate._id }).exec();

            const candidateObj = candidate.toObject();
            const complited = candidateObj.userPassedIds.includes(userId)

            delete candidateObj.userPassedIds

            res.json({
                ...candidateObj,
                complited,
                questions,
            });
        } else {
            res.sendStatus(404).json({error: `test with id ${req.params.testId} not found`});
        }

    } catch (err) { 
        next(err);
    }
})

module.exports = router;
