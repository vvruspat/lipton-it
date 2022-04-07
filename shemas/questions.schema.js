const { Schema, model } = require('mongoose');

const QuestionsSchema = new Schema({
    testId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true, },
    description: {type: String},
    data: {type: [String]},
});

const Questions = model('Questions', QuestionsSchema);

module.exports = Questions;