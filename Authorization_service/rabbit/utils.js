const amqplib = require("amqplib");

const rabbitBirth = async () => {
  const conn = await amqplib.connect(process.env.RABBIT_CONNECTION);

  conn.addListener("error", (err) => {
    console.log(`RabbitMq error: ${err}`);
  });
  return await conn.createConfirmChannel();
};

module.exports = rabbitBirth;
