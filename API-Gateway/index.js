const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
const axios = require("axios");
const https = require("https");
const amqplib = require("amqplib");

const App = require("express")();

App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.use(helmet());

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const queueName = "test";

const receiveMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  const msg = await channel.consume(
    queueName,
    (msg) => {
      console.log("[X] received:", msg.content.toString());
    },
    { noAck: true }
  );
  setTimeout(() => {
    connection.close();
  }, 500);
};

App.get("/hello", async (req, res) => {
  const data = await axios.get("https://127.0.0.1/auth/hello", { httpsAgent });
  const queueData = await receiveMsg();
  res
    .status(200)
    .json({ Queue: queueData, data: data.data, headers: data.headers, server: data.server });
});

const PORT = process.env.PORT | 3000;
App.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
