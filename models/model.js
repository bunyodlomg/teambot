const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: { type: Number, unique: true, required: true },
    first_name: String,
    last_name: String,
    admin: Boolean,
    queue: { type: Boolean, default: false },
    rule: { type: Boolean, default: false }
});
const queueSchema = new Schema({
    date: { type: String, required: true },
    skip: { type: Number, required: true }
});

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

const finance = new Schema({
    user_id: { type: Number, required: true },
    created_date: { type: Date, required: true },
    summa: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    accepted: { type: Boolean, default: false },
});

const feedbackSchema = new Schema({
    feedback: { type: String, required: true },
    created_date: { type: Date, required: true }
});

const usersSchema = new Schema({
    user_id: String,
    status: String,
    sended: Date,
    accepted: Date
}, { _id: false });

const tasksSchema = new Schema({
    admin_id: { type: Number },
    users_id: [usersSchema],
    task: { type: String, required: true },
    created_date: { type: Date, required: true }
    // task_id: { type: String, required: true},
    // status: { type: String, required: true}
});

const User = model('User', userSchema);
const Queue = model('Queue', queueSchema);
const Attendance = model('Attendance', attendanceSchema);
const Finance = model('Finance', finance);
const Feedback = model('Feedback', feedbackSchema);
const Tasks = model('Tasks', tasksSchema);

module.exports = {
    User,
    Queue,
    Attendance,
    Finance,
    Feedback,
    Tasks
};
