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
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "planet",
    host: process.env.DB_URL,
    dialect: "mysql",
    logging: false,
    timezone: "+05:00",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  },
};
