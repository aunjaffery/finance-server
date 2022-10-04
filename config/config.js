module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "finance",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
    timezone: "+05:00",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
};
