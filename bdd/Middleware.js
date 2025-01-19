

const middleware = async (context, next) => {
    const { repondre, isBotAdmin, isAdmin } = context;

    if (!m.isGroup) {
        return repondre("This command is meant for groups");
    }
    if (!isAdmin) {
        return repondre("You need admin privileges");
    }
    if (!isBotAdmin) {
        return repondre("I need admin privileges");
    }

    await next(); // Proceed to the next function (main handler)
};

module.exports = middleware;
