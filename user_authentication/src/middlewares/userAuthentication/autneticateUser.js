const { rabbitBirth, validateUser } = require("../../../rabbit/utils");

const authUserMiddleware = async (req, res, next) => {
  const channel = await rabbitBirth();
  try {
    if (!req.cookies.refreshToken && !req.cookies.accessToken) {
      throw { error: "Invalid JWT" };
    }

    const { content: userValidation, consumerTag: validateConsumerTag } = await validateUser(
      channel,
      {
        refreshToken: req.cookies.refreshToken,
        accessToken: req.cookies.accessToken,
      }
    );

    if (userValidation.err !== undefined) {
      throw { error: userValidation.err.message };
    }

    channel.cancel(validateConsumerTag);
    res.locals.tenantId = userValidation.tenantId;
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  authUserMiddleware,
};
