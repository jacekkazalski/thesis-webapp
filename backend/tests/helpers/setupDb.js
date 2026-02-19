const fs = require("fs");
const path = require("path");
const sequelize = require("../../config/database");

async function resetDatabase() {
  
   try {
    const sql = fs.readFileSync(path.join(__dirname, "./test_seed.sql"), "utf8");
    // split by semicolon and execute each statement separately to avoid multi-statement issues
    const statements = sql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await sequelize.query(statement);
    }
  } catch (error) {
    console.error("Database reset failed:", error);
    throw error;
  }
}
module.exports = { resetDatabase };
