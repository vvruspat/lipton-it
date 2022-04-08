const { Router } = require('express');
const mongoose = require('mongoose');
const Questions = require('../shemas/questions.schema');
const Results = require('../shemas/results.schema');
const Tests = require('../shemas/test.schema');

const router = Router();

router.post('/', async (req, res, next) => {
    const { questionId, data } = req.body
    const { vk_user_id: userId } = req.app.get('authData');

    const questionObjectId = mongoose.Types.ObjectId(questionId);

    try {
        const result = new Results({ questionId: questionObjectId, data, userId, createdAt: new Date().toISOString() })
        const question = await Questions.findById(questionId).exec();

        const testId = question.testId;
        const test = await Tests.findById(testId);

        if(!test.userPassedIds.includes(userId)){
            await Tests.findByIdAndUpdate(testId, {userPassedIds: [...test.userPassedIds, userId]})
        }

        await result.save();

        res.sendStatus(200);
         
    } catch (err) { 
        next(err)
    }
})
 
router.get('/:testId', async (req, res, next) => { 
    const { testId } = req.params;

    try {
        const test = await Tests.findById(testId).exec();
        const questions = await Questions.find({ testId }).exec();

        const questionIds = questions.map((question) => question._id)

        const results = await Results.find({ questionId: questionIds })
        
        const hashMapOfResults = results.reduce((acc, result) => {

            const questionId = result.questionId;

            if (acc[questionId]) {
                acc[questionId].push(result)
            } else { 
                acc[questionId] = [result]
            }

            return acc;
         }, {})

        const questionsWithResults = questions.map((question) => {
            return { ...(question.toObject()), results: hashMapOfResults[question._id] ?? []}
        });

        res.json({ ...(test.toObject()), questions: questionsWithResults})

    } catch (err) { 
        next(err)
    }

})



module.exports = router;