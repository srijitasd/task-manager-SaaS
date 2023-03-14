const rabbitBirth = require("../rabbit/utils");
const { INVITE_EMAIL } = require("./constants");
const { generateJwtToken } = require("../src/helpers/InviteHelper/inviteJwtHelper");
const { transporter } = require("../src/helpers/InviteHelper/inviteEmailHelper");

exports.sendMail = async () => {
  const channel = await rabbitBirth();
  try {
    channel.assertExchange(INVITE_EMAIL.exchangeName, INVITE_EMAIL.exchangeType);
    const { queue } = await channel.assertQueue(INVITE_EMAIL.queueName);
    channel.bindQueue(queue, INVITE_EMAIL.exchangeName, INVITE_EMAIL.routingKey);

    channel.consume(
      queue,
      async (msg) => {
        console.log("Consuming MAIL QUEUE");
        const userData = JSON.parse(msg.content.toString());
        channel.ack(msg);

        userData.invitees &&
          userData.invitees.forEach(async (invitee) => {
            var data = {
              tenantId: userData.tenantId,
              inviteId: userData.inviteId,
              inviterId: userData.inviterId,
              inviterName: userData.inviterName,
              projectId: userData.projectId,
              invitee,
              slug: userData.slug,
            };
            const expiresIn = userData.expiresIn ? userData.expiresIn : "1d";
            const signature = generateJwtToken(data, expiresIn);
            const url = `http:///${
              userData.slug
            }.localhost:3000/team/invite?signature=${encodeURIComponent(signature)}`; //* URL FOR FRONTEND USE ONLY

            let mailOptions = {
              from: process.env.INVITE_GMAIL_USERNAME,
              to: invitee,
              subject: "Project invite request",
              template: "invite", // the name of the template file i.e email.handlebars
              context: {
                url: url,
                name: "name name",
              },
            };

            await transporter.sendMail(mailOptions);

            channel.publish(
              INVITE_EMAIL.exchangeName,
              INVITE_EMAIL.confirmRoutingKey,
              Buffer.from(JSON.stringify({ invitees: userData.invitees }))
            );
          });
      },
      { noAck: false }
    );
  } catch (err) {
    console.log("err");

    channel.publish(
      VALIDATE_TENANT.exchangeName,
      VALIDATE_TENANT.confirmRoutingKey,
      Buffer.from(JSON.stringify({ err }))
    );
  }
};
