const { workLate } = require('./workLate');
const { workNotStart } = require('./workNotStart');

const workDescription = async (ctx, id, type) => {

    switch (type) {
        case 'late':
            workLate(ctx, id)
            break;
        case 'not_start':
            workNotStart(ctx, id)
            break;
        default:
            break;
    }
}
module.exports = { workDescription }