const VALIDATE_USER = {
  exchangeName: "VALIDATE_USER",
  exchangeType: "direct",
  routingKey: "user.validate",
  queueName: "user.validate",
  confirmQueue: "user.validate.complete",
  confirmRoutingKey: "user.validate.complete",
};

const VALIDATE_DOMAIN = {
  exchangeName: "VALIDATE_DOMAIN",
  exchangeType: "direct",
  routingKey: "domain.validate",
  queueName: "domain.validate",
  confirmQueue: "domain.validate.complete",
  confirmRoutingKey: "domain.validate.complete",
};

module.exports = { VALIDATE_USER, VALIDATE_DOMAIN };
