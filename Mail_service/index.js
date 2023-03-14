const App = require("express")();
const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
const { sendMail } = require("./rabbit/receivers");

App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.use(helmet());
App.use(cors());

sendMail();

const PORT = process.env.PORT | 3002;
App.listen(PORT, () => {
  console.log(`Mail service is running on PORT: ${PORT}`);
});
