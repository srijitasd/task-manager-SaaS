const { rabbitBirth } = require("../rabbit/utils");
const { REGISTER_TENANT } = require("./constants");

const { selectUserAppModel } = require("../src/helpers/tenantDbHelper");

exports.createTenantUser = async () => {
  const channel = await rabbitBirth();
  try {
    channel.assertExchange(REGISTER_TENANT.exchangeName, REGISTER_TENANT.exchangeType);
    const { queue } = await channel.assertQueue(REGISTER_TENANT.queueName);
    channel.bindQueue(queue, REGISTER_TENANT.exchangeName, REGISTER_TENANT.routingKey);

    channel.consume(
      queue,
      async (msg) => {
        console.log("Consuming TENANT service");
        console.log(msg.content.toString());
        const userData = JSON.parse(msg.content.toString());

        const { model: User, database } = await selectUserAppModel(userData._id, "users", "user");
        try {
          const user = new User({ ...userData, tenantId: userData._id });
          await user.save();
          const { accessToken, refreshToken } = await user.generateAuthToken();
          console.log("running");

          channel.publish(
            REGISTER_TENANT.exchangeName,
            REGISTER_TENANT.confirmRoutingKey,
            Buffer.from(JSON.stringify({ user, tokens: { accessToken, refreshToken } }))
          );
        } catch (err) {
          console.log("err");
          await database.dropDatabase();
          channel.publish(
            REGISTER_TENANT.exchangeName,
            REGISTER_TENANT.confirmRoutingKey,
            Buffer.from(JSON.stringify({ err }))
          );
        }
      },
      { noAck: true }
    );
  } catch (err) {
    console.log("err");

    channel.publish(
      REGISTER_TENANT.exchangeName,
      REGISTER_TENANT.confirmRoutingKey,
      Buffer.from(JSON.stringify({ err }))
    );
  }
};
