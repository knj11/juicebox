const getPostById = require("./helper/getPostById.js")
const createPostTag = require("./helper/createPostTag.js")

async function addTagsToPost(postId, tagList) {
  try {
    const createPostTagPromises = tagList.map(
      tag => createPostTag(postId, tag.id)
    );

    await Promise.all(createPostTagPromises);

    console.log("After post tags")
    return await getPostById(postId);
  } catch (error) {
    throw error;
  }
}

module.exports = addTagsToPost;