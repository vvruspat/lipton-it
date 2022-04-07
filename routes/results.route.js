const { Router } = require('express');
const mongoose = require('mongoose');
const Results = require('../shemas/results.schema');

const router = Router();

router.post('/add', async (req, res, next) => {
    const { questionId, data } = req.body
    const { vk_user_id: userId } = req.app.get('authData');

    const questionObjectId = mongoose.Types.ObjectId(questionId);

    try {
        const result = new Results({ questionId: questionObjectId, data, userId })

        await result.save();

        res.sendStatus(200);
         
    } catch (err) { 
        next(err)
    }
 })



module.exports = router;