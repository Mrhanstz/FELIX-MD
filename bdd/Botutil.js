

const Ownermiddleware = async (context, next) => {
    const { repondre, Owner } = context;

    if (!Owner) {
        return repondre("You need owner privileges to execute this command.");
    }

    await next();
};

module.exports = Ownermiddleware;
