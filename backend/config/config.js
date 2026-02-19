require("dotenv").config();

const base = {
  host: process.env.DB_HOST || "localhost",
  dialect: "postgres",
  pool: {
    max: Number(process.env.DB_POOL_MAX ?? 10),
    min: 0,
    acquire: 20000,
    idle: 10000,
  },
};

const development = {
  ...base,
  username: process.env.DB_USER_DEV || process.env.DB_USER,
  password: process.env.DB_PASSWORD_DEV || process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_DEV || process.env.DB_DATABASE,
  logging: (sql, timing) => {
    console.log(sql);
    if (timing !== undefined) console.log("Execution time:", timing, "ms");
  },
  benchmark: true,
};

const test = {
  ...base,
  username: process.env.DB_USER_TEST || process.env.DB_USER,
  password: process.env.DB_PASSWORD_TEST || process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_TEST,
  logging: false,
};

const production = {
  ...base,
  username: process.env.DB_USER_PROD || process.env.DB_USER,
  password: process.env.DB_PASSWORD_PROD || process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_PROD || process.env.DB_DATABASE,
  logging: false,
};

module.exports = { development, test, production };
