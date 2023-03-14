const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");

require("./src/db/connction");
const { validateTenant } = require("./rabbit/receivers");
const manageTenantRouter = require("./src/routes/tenantRoute");

const App = require("express")();

App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.use(helmet());
App.use(cors());

validateTenant();

App.use(manageTenantRouter);

const PORT = process.env.PORT | 4000;
App.listen(PORT, () => {
  console.log(`Tenant service is running on PORT: ${PORT}`);
});
