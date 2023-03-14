const { connect } = require("../db/mongoose");

const mongoUrl = process.env.MONGODB_URL;
let db;
let model;

const getDb = async () => {
  if (db) {
    console.log("customer db is already set");
    return db;
  } else if (!db) {
    console.log("setting customer db");
    db = await connect(mongoUrl);
    return db;
  }
};

const getTenantDb = async (tenantId) => {
  const dbName = `tenant-${tenantId}`;
  const tenantConnection = await getDb();
  return tenantConnection.useDb(dbName, { useCache: true });
};

const selectUserAppModel = async (tenantId, modelName, schema) => {
  model = require(`../models/${schema}`);
  const tenantDb = await getTenantDb(tenantId);

  return {
    model: tenantDb.models[modelName]
      ? tenantDb.model(modelName)
      : tenantDb.model(modelName, model),
    database: tenantDb,
  };
};

module.exports = {
  selectUserAppModel,
};
