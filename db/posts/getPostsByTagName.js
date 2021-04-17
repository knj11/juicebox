const client = require("../client.js")
const getPostById = require("./helper/getPostById.js")

async function getPostsByTagName(tagName) {
  try {
    const { rows: postIds } = await client.query(`
      SELECT posts.id
      FROM posts
      JOIN post_tags ON posts.id=post_tags."postId"
      JOIN tags ON tags.id=post_tags."tagId"
      WHERE tags.name=$1;
    `, [tagName]);

    return await Promise.all(postIds.map(
      post => getPostById(post.id)
    ));
  } catch (error) {
    throw error;
  }
} 

module.exports = getPostsByTagName;