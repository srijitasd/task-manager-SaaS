const amqplib = require("amqplib");

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

module.exports = rabbitBirth;
