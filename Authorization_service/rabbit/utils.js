const amqplib = require("amqplib");
const { VALIDATE_DOMAIN } = require("./constants");

let conn;
const getRabbitConn = async () => {
  if (conn) {
    return conn;
  } else if (!conn) {
    conn = await amqplib.connect(process.env.RABBIT_CONNECTION);
    return conn;
  }
};

const rabbitBirth = async () => {
  const conn = await getRabbitConn();
  return conn.createChannel();
};

const validateDomainRabbit = async (channel, data) => {
  //console.log(data);
  await channel.assertExchange(VALIDATE_DOMAIN.exchangeName, VALIDATE_DOMAIN.exchangeType);
  channel.publish(
    VALIDATE_DOMAIN.exchangeName,
    VALIDATE_DOMAIN.routingKey,
    Buffer.from(JSON.stringify(data))
  );

  const { queue } = await channel.assertQueue(VALIDATE_DOMAIN.confirmQueue);
  channel.bindQueue(queue, VALIDATE_DOMAIN.exchangeName, VALIDATE_DOMAIN.confirmRoutingKey);

  const { content, consumerTag } = await new Promise((resolve, reject) => {
    channel.consume(
      queue,
      async (msg) => {
        console.log("Consuming TENANT VALIDATION service");
        console.log(msg.content.toString());
        resolve({
          content: JSON.parse(msg.content.toString()),
          consumerTag: msg.fields.consumerTag,
        });
      },
      { noAck: true }
    );
  });

  return { content, consumerTag };
};

module.exports = { rabbitBirth, validateDomainRabbit };
