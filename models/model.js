const { Schema, model } = require('mongoose');
const { dateFormat } = require('../bot/helper/dateFormat');

// Define the schema for the users collection
const userSchema = new Schema({
    id: { type: Number, unique: true, required: true },
    first_name: String,
    last_name: String,
    admin: Boolean,
    queue: { type: Boolean, default: false }
});
const queueSchema = new Schema({
    date: { type: String, required: true },
    skip: { type: Number, required: true }
});

// Define the schema for the attendances collection
const attendanceSchema = new Schema({
    user_id: { type: Number, required: true },
    start_date: { type: Date, default: null },
    late_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    created_date: { type: Date, required: true },
    location: String,
    status: { type: String, required: true },
    description: { type: Object, default: null },
    created_date: Date,
    accepted: { type: Boolean, default: false },
});

// Define the schema for the outgoing collection
const outgoingSchema = new Schema({
    user_id: { type: Number, required: true },
    created_date: { type: Date, required: true },
    summa: { type: Number, required: true },
    description: { type: String, required: true },
});

// Define the schema for the feedback collection
const feedbackSchema = new Schema({
    feedback: { type: String, required: true },
    created_date: { type: Date, required: true }
});

// Define the schema for the principles collection
const principleSchema = new Schema({
    principle: { type: String, required: true },
    file_id: String
});

// Define the schema for the principles_users collection
const principleUserSchema = new Schema({
    user_id: { type: Number, required: true },
    principle_id: { type: Number, required: true }
});

// Define models based on the schemas
const User = model('User', userSchema);
const Queue = model('Queue', queueSchema);
const Attendance = model('Attendance', attendanceSchema);
const Outgoing = model('Outgoing', outgoingSchema);
const Feedback = model('Feedback', feedbackSchema);
const Principle = model('Principle', principleSchema);
const PrincipleUser = model('PrincipleUser', principleUserSchema);

// Export models
module.exports = {
    User,
    Queue,
    Attendance,
    Outgoing,
    Feedback,
    Principle,
    PrincipleUser
};
