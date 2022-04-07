const { Schema, model } = require('mongoose');

const TestsSchema = new Schema({
    testType: {
        type: String, required: true, enum: ['five_sec', 'side_by_side', 'first_click']
    },
    title: String,
    status: {
        type: String, required: true, enum: ['available', 'completed', 'unavailable']
    }
});

const Tests = model('Tests', TestsSchema);

module.exports = Tests;