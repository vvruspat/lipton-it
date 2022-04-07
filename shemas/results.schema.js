const { Schema, model } = require('mongoose');

const ResultsSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: String, required: true },
    data: {type: String, required: true}
});

const Results = model('Results', ResultsSchema);

module.exports = Results;