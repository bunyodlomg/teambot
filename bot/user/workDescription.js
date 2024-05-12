const { feedback } = require('./feedback/feedback');
const { workLate } = require('./workDay/workLate');
const { workNotStart } = require('./workDay/workNotStart');
const workDescription = async (ctx, id, type) => {
    switch (type) {
        case 'late':
            workLate(ctx, id)
            break;
        case 'not_start':
            workNotStart(ctx, id)
            break;
        case 'feedback':
            feedback(ctx, id)
            break;
        default:
            break;
    }
}
module.exports = { workDescription }