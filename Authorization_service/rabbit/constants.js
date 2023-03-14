const VALIDATE_USER = {
  exchangeName: "VALIDATE_USER",
  exchangeType: "direct",
  routingKey: "user.validate",
  queueName: "user.validate",
  confirmQueue: "user.validate.complete",
  confirmRoutingKey: "user.validate.complete",
};

module.exports = { VALIDATE_USER };
