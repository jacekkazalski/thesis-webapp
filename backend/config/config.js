require("dotenv").config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === "test"
      ? process.env.DB_DATABASE_TEST
      : process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: "postgres",
  pool: {
    max: Number(process.env.DB_POOL_MAX ?? 10),
    min: 0,
    acquire: 20000,
    idle: 10000,
  },
};

module.exports = {
  development: {
    ...base,
    logging: (sql, timing) => {
      console.log(sql);
      if (timing !== undefined) console.log("Execution time:", timing, "ms");
    },
    benchmark: true,
  },
  test: {
    ...base,
    logging: false,
  },
  production: {
    ...base,
    logging: false,
  },
};
