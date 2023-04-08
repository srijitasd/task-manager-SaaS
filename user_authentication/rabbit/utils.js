const amqplib = require("amqplib");
const { VALIDATE_DOMAIN, VALIDATE_USER, INVITE_EMAIL } = require("./constants");

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

const validateTenantRabbit = async (channel, data) => {
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

const validateUser = async (channel, data) => {
  await channel.assertExchange(VALIDATE_USER.exchangeName, VALIDATE_USER.exchangeType);
  channel.publish(
    VALIDATE_USER.exchangeName,
    VALIDATE_USER.routingKey,
    Buffer.from(JSON.stringify(data)),
    undefined
  );

  const { queue } = await channel.assertQueue(VALIDATE_USER.confirmQueue);
  channel.bindQueue(queue, VALIDATE_USER.exchangeName, VALIDATE_USER.confirmRoutingKey);

  const { content, consumerTag } = await new Promise((resolve, reject) => {
    channel.consume(
      queue,
      async (msg) => {
        console.log("Consuming USER VALIDATION service");

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

const sendMail = async (channel, data) => {
  await channel.assertExchange(INVITE_EMAIL.exchangeName, INVITE_EMAIL.exchangeType);
  channel.publish(
    INVITE_EMAIL.exchangeName,
    INVITE_EMAIL.routingKey,
    Buffer.from(JSON.stringify(data))
  );

  const { queue } = await channel.assertQueue(INVITE_EMAIL.confirmQueue);
  channel.bindQueue(queue, INVITE_EMAIL.exchangeName, INVITE_EMAIL.confirmRoutingKey);

  const { content, consumerTag } = await new Promise((resolve, reject) => {
    channel.consume(
      queue,
      async (msg) => {
        console.log("Consuming EMAIL QUEUE");

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

module.exports = { rabbitBirth, validateTenantRabbit, validateUser, sendMail };
