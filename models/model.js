const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    id: { type: Number, unique: true, required: true },
    first_name: String,
    last_name: String,
    username: String,
});

const notFound = new Schema({
    user_id: { type: Number },
    username: {type: String},
    text: { type: String },
    is_checked: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const lyric = new Schema({
    id: { type: String},
    user_id: { type: Number},
    text: { type: String },
    singer: { type: String },
    title: { type: String },
    created_at: { type: Date, default: Date.now }
});


const feedbackSchema = new Schema({
    feedback: { type: String, required: true },
    created_date: { type: Date, required: true }
});


const User = model('User', userSchema);
const NotFound = model('NotFound', notFound);
const Lyric = model('Lyric', lyric);
const Feedback = model('Feedback', feedbackSchema);

module.exports = {
    User,
    NotFound,
    Lyric,
    Feedback
};
