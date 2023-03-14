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

App.get("/hello", async (req, res) => {
  await sndMsg();
  res.status(200).send({ message: "hello from Authorization server" });
});

const PORT = process.env.PORT | 9000;
App.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
