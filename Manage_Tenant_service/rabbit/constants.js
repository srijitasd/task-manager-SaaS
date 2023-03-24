const REGISTER_TENANT = {
  exchangeName: "REGISTER_TENANT",
  exchangeType: "direct",
  routingKey: "tenant.create",
  queue: "tenant.signup",
  confirmQueue: "tenant.signup.complete",
  confirmRoutingKey: "tenant.signup.complete",
};

const VALIDATE_DOMAIN = {
  exchangeName: "VALIDATE_DOMAIN",
  exchangeType: "direct",
  routingKey: "domain.validate",
  queueName: "domain.validate",
  confirmQueue: "domain.validate.complete",
  confirmRoutingKey: "domain.validate.complete",
};

module.exports = { REGISTER_TENANT, VALIDATE_DOMAIN };
