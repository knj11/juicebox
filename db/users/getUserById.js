const client = require("../client.js");
const getPostsByUser = require("../posts/getPostsByUser.js");

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username, name, location, active
      FROM users
      WHERE id=${userId}
    `);

    if (!user) {
      return null
    }

    user.posts = await getPostsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = getUserById;