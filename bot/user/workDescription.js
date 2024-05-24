const { feedback } = require('./feedback/feedback');
const { workLate } = require('./workDay/workLate');
const { workNotStart } = require('./workDay/workNotStart');
const workDescription = async (ctx, type, user) => {
    switch (type) {
        case 'late':
            workLate(ctx, user)
            break;
        case 'not_start':
            workNotStart(ctx, user)
            break;
        case 'feedback':
            feedback(ctx, user)
            break;
        default:
            break;
    }
}
module.exports = { workDescription }