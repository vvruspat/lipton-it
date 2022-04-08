const { Schema, model } = require('mongoose');

const TestsSchema = new Schema({
    userId: { type: String, required: true, },
    title: { type: String, required: true, },
    description: {type: String},
    testType: {
        type: String, required: true, enum: ['five_sec', 'side_by_side', 'first_click']
    },
    status: {
        type: String, required: true, enum: ['available', 'completed', 'unavailable']
    },
    createdAt: Date,
    userPassedIds: [{type: String}]
});

const Tests = model('Tests', TestsSchema);

module.exports = Tests;