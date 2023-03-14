const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
const { validateUser } = require("./rabbit/receivers");

const App = require("express")();

App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.use(helmet());
App.use(cors());

validateUser();

// const queueName = "test";
// const msg = "Hello World";

// const sndMsg = async () => {
//   const connection = await amqplib.connect("amqp://localhost");
//   const channel = await connection.createChannel();
//   await channel.assertQueue(queueName, { durable: false });
//   channel.sendToQueue(queueName, Buffer.from(msg));
//   console.log(`Sent: ${msg}`);
//   setTimeout(() => {
//     connection.close();
//   }, 500);
// };

App.get("/hello", async (req, res) => {
  await sndMsg();
  res.status(200).send({ message: "hello from Authorization server" });
});

const PORT = process.env.PORT | 9000;
App.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
