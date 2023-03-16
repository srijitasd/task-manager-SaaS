const { default: slugify } = require("slugify");
const rabbitBirth = require("../../rabbit/utils");
const Tenant = require("../models/tenant");
const { REGISTER_TENANT } = require("../../rabbit/constants");

const createTenant = async (req, res) => {
  const channel = await rabbitBirth();
  var session;
  try {
    const slug = slugify(req.body.company.name, "").toLowerCase();

    //* CREATE TENANT IN MASTER DB
    session = await Tenant.startSession();
    session.startTransaction();
    const tenant = new Tenant({ ...req.body, slug });
    await tenant.save({ session });

    await channel.assertExchange(REGISTER_TENANT.exchangeName, REGISTER_TENANT.exchangeType);
    channel.publish(
      REGISTER_TENANT.exchangeName,
      REGISTER_TENANT.routingKey,
      Buffer.from(
        JSON.stringify({
          _id: tenant._id,
          name: tenant.name,
          email: tenant.email,
          password: req.body.password,
          role: "Tenant",
        })
      )
    );

    const { queue } = await channel.assertQueue(REGISTER_TENANT.confirmQueue);
    channel.bindQueue(queue, REGISTER_TENANT.exchangeName, REGISTER_TENANT.confirmRoutingKey);

    const { content, consumerTag } = await new Promise((resolve, reject) => {
      channel.consume(
        queue,
        async (msg) => {
          console.log("Consuming USER service");
          console.log(msg);
          resolve({
            content: JSON.parse(msg.content.toString()),
            consumerTag: msg.fields.consumerTag,
          });
        },
        { noAck: true }
      );
    });

    console.log(content, consumerTag);

    if (content.err !== undefined) {
      throw { error: content.err.message };
    }

    await session.commitTransaction();
    res.status(201).send(content);
    channel.cancel(consumerTag);
  } catch (error) {
    if (error.code === 11000) {
      await session.abortTransaction();
      res.status(400).send({ error: "This slug is already taken" });
    }
  } finally {
    await session.endSession();
  }
};

module.exports = { createTenant };
