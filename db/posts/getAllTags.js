const client = require("../client.js")

async function getAllTags() {
  try {
    const { rows: tags } = await client.query(`
      SELECT *
      FROM tags;
    `);

    return tags;
  } catch (error) {
    throw error;
  }
}

module.exports = getAllTags;