const jwt = require("jsonwebtoken");
const rabbitBirth = require("../rabbit/utils");
const { VALIDATE_USER } = require("./constants");

exports.validateUser = async () => {
  const channel = await rabbitBirth();
  try {
    channel.assertExchange(VALIDATE_USER.exchangeName, VALIDATE_USER.exchangeType);
    const { queue } = await channel.assertQueue(VALIDATE_USER.queueName);
    channel.bindQueue(queue, VALIDATE_USER.exchangeName, VALIDATE_USER.routingKey);

    channel.consume(
      queue,
      async (msg) => {
        console.log("Consuming USER VALIDATION service");
        const userData = JSON.parse(msg.content.toString());
        console.log(userData);
        channel.ack(msg);

        const decodedData = jwt.verify(userData.refreshToken, process.env.JWT_ACCESS);
        console.log(decodedData);

        channel.publish(
          VALIDATE_USER.exchangeName,
          VALIDATE_USER.confirmRoutingKey,
          Buffer.from(JSON.stringify({ ...decodedData, consumerTag: msg.fields.consumerTag }))
        );
      },
      { noAck: false }
    );
  } catch (err) {
    console.log(err);
    console.log("err");

    channel.publish(
      VALIDATE_USER.exchangeName,
      VALIDATE_USER.confirmRoutingKey,
      Buffer.from(JSON.stringify({ err }))
    );
  }
};
