const createTags = require("../posts/createTags.js")
const getAllPosts = require("../posts/getAllPosts.js")
const addTagsToPost = require("../posts/addTagsToPost.js")

async function createInitialTags() {
  try {
    console.log("Starting to create tags...");

    const [happy, sad, inspo, catman] = await createTags([
      '#happy', 
      '#worst-day-ever', 
      '#youcandoanything',
      '#catmandoeverything'
    ]);
    console.log("Finiahed creating tags....")
    console.log("attempting to get all posts...")

    const [postOne, postTwo, postThree] = await getAllPosts();

    console.log("got all posts....")
    console.log(happy)

    console.log("attempting to add tags to posts...")

    await addTagsToPost(postOne.id, [happy, inspo]);
    await addTagsToPost(postTwo.id, [sad, inspo]);
    await addTagsToPost(postThree.id, [happy, catman, inspo]);

    console.log("Finished creating tags!");
  } catch (error) {
    console.log("Error creating tags!");
    throw error;
  }
}

module.exports = createInitialTags;