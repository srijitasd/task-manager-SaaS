const { validateTenantRabbit, rabbitBirth } = require("../../../rabbit/utils");

const validateTenantMiddleware = async (req, res, next) => {
  const channel = await rabbitBirth();
  try {
    const { content: tenantContent, consumerTag: originConsumerTag } = await validateTenantRabbit(
      channel,
      {
        origin: req.headers.origin,
      }
    );
    console.log(tenantContent);
    await channel.cancel(originConsumerTag);
    res.locals.tenantId = tenantContent.tenantId;
    res.locals.slug = tenantContent.slug;
    next();

    if (tenantContent.err !== undefined) {
      throw { error: tenantContent.err.message };
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  validateTenantMiddleware,
};
