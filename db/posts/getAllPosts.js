const client = require("../client.js")
const getPostById = require("./helper/getPostById.js")

async function getAllPosts() {
  try {
    const { rows: postIds } = await client.query(`
      SELECT *
      FROM posts;
    `);

    const posts = await Promise.all(postIds.map(
      post => getPostById( post.id )
    ));

    return posts;
  } catch (error) {
    throw error;
  }
}

module.exports = getAllPosts;