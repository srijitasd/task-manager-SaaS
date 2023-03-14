const REGISTER_TENANT = {
  exchangeName: "REGISTER_TENANT",
  exchangeType: "direct",
  routingKey: "tenant.create",
  queue: "tenant.signup",
  confirmQueue: "tenant.signup.complete",
  confirmRoutingKey: "tenant.signup.complete",
};

const VALIDATE_TENANT = {
  exchangeName: "VALIDATE_TENANT",
  exchangeType: "direct",
  routingKey: "tenant.validate",
  queueName: "tenant.validate",
  confirmQueue: "tenant.validate.complete",
  confirmRoutingKey: "tenant.validate.complete",
};

module.exports = { REGISTER_TENANT, VALIDATE_TENANT };
