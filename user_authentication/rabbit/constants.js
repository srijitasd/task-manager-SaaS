const REGISTER_TENANT = {
  exchangeName: "REGISTER_TENANT",
  exchangeType: "direct",
  routingKey: "tenant.create",
  queueName: "tenant.signup",
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

const VALIDATE_USER = {
  exchangeName: "VALIDATE_USER",
  exchangeType: "direct",
  routingKey: "user.validate",
  queueName: "user.validate",
  confirmQueue: "user.validate.complete",
  confirmRoutingKey: "user.validate.complete",
};

const INVITE_EMAIL = {
  exchangeName: "MAIL_EXCHANGE",
  exchangeType: "direct",
  routingKey: "mail.invite",
  queueName: "mail.user",
  confirmQueue: "mail.user.sent",
  confirmRoutingKey: "mail.invite.sent",
};

module.exports = { REGISTER_TENANT, VALIDATE_TENANT, VALIDATE_USER, INVITE_EMAIL };
