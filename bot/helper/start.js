const {forAdmin} = require('../admin/admin');
const {forUser} = require('../user/user');
const start = async (ctx, text) => {
    const id = ctx.from.id
    if (id === 51504673121) {
        await forAdmin(ctx, text)
    } else {
        await forUser(ctx, text)
    }
}
module.exports = {start}