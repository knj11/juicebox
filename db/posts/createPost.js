const client = require("../client.js");
const createTags = require("./createTags.js");
const addTagsToPost = require("./addTagsToPost.js")

async function createPost({
  authorId,
  title,
  content,
  tags = []
}) {
  try {
    const { rows: [post] } = await client.query(`
      INSERT INTO posts("authorId", title, content) 
      VALUES($1, $2, $3)
      RETURNING *;
    `, [authorId, title, content]);

    const tagList = await createTags(tags)

    return await addTagsToPost(post.id, tagList);
  } catch (error) {
    throw error;
  }
}

module.exports = createPost;