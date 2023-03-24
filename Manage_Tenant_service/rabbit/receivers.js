const rabbitBirth = require("../rabbit/utils");
const { VALIDATE_DOMAIN } = require("./constants");
const Tenant = require("../src/models/tenant");

exports.validateTenant = async () => {
  const channel = await rabbitBirth();
  try {
    channel.assertExchange(VALIDATE_DOMAIN.exchangeName, VALIDATE_DOMAIN.exchangeType);
    const { queue } = await channel.assertQueue(VALIDATE_DOMAIN.queueName);
    channel.bindQueue(queue, VALIDATE_DOMAIN.exchangeName, VALIDATE_DOMAIN.routingKey);

    channel.consume(
      queue,
      async (msg) => {
        console.log("Consuming VALIDATION service");
        const userData = JSON.parse(msg.content.toString());
        console.log(userData);
        channel.ack(msg);

        const slug = userData.origin.split(".")[0].split("//")[1];

        let validCompany = await Tenant.findOne({ slug });

        if (validCompany !== null) {
          channel.publish(
            VALIDATE_DOMAIN.exchangeName,
            VALIDATE_DOMAIN.confirmRoutingKey,
            Buffer.from(JSON.stringify({ slug: validCompany.slug, tenantId: validCompany._id }))
          );
        } else {
          channel.publish(
            VALIDATE_DOMAIN.exchangeName,
            VALIDATE_DOMAIN.confirmRoutingKey,
            Buffer.from(
              JSON.stringify({
                err: {
                  error: "Invalid company",
                },
              })
            )
          );
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.log("err");

    channel.publish(
      VALIDATE_DOMAIN.exchangeName,
      VALIDATE_DOMAIN.confirmRoutingKey,
      Buffer.from(JSON.stringify({ err }))
    );
  }
};
