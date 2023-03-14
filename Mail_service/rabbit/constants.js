const INVITE_EMAIL = {
  exchangeName: "MAIL_EXCHANGE",
  exchangeType: "direct",
  routingKey: "mail.invite",
  queue: "mail.user",
  confirmQueue: "mail.user.sent",
  confirmRoutingKey: "mail.invite.sent",
};

module.exports = { INVITE_EMAIL };
