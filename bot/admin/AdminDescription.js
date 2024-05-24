const { addUser } = require("./addUser");
const { deleteUser } = require("./deleteUser");

const AdminDescription = async (ctx, check_user) => {
    switch (check_user.type) {
        case 'add_user':
            addUser(ctx)
            break;
        case 'delete_user':
            deleteUser(ctx)
            break;
        default:
            break;
    }
}

module.exports = {
    AdminDescription
} 