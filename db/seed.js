const client = require("./client.js");

//BootStrap functions
const rebuildDB = require("./rebuildDB.js")
const testDB = require("./testDB.js")



rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());