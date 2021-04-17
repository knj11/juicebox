const client = require("./client.js")

//build DB functions
const dropTables = require("./buildDb/dropTables.js")
const createTables = require("./buildDb/createTables.js")
const createInitialUsers = require("./buildDb/createInitialUsers.js")
const createInitialPosts = require("./buildDb/createInitialPosts.js")

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error;
  }
}

module.exports = rebuildDB;