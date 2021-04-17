const client = require("../client.js")

async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const { rows: [post] } = await client.query(`
      INSERT INTO posts("authorId", title, content) 
      VALUES($1, $2, $3)
      RETURNING *;
    `, [authorId, title, content]);

    return post;
  } catch (error) {
    throw error;
  }
}

module.exports = createPost;