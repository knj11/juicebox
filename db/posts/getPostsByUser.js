const client = require("../client.js")
const getPostById = require("./helper/getPostById.js")

async function getPostsByUser(userId) {
  try {
    const { rows: postIds } = await client.query(/*sql*/`
      SELECT * 
      FROM posts
      WHERE "authorId"=${userId};
    `);

    const posts = await Promise.all(postIds.map(
      post => getPostById( post.id )
    ))

    return posts;
  } catch (error) {
    throw error;
  }
}

module.exports = getPostsByUser;