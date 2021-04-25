// api/tags.js
const express = require('express');
const getAllTags = require('../db/posts/getAllTags.js');
const getPostsByTagName = require('../db/posts/getPostsByTagName.js');

const tagsRouter = express.Router();


tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next()
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags
  });

});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const tagname = req.params.tagName

  try {
    // use our method to get posts by tag name from the db
    const allPosts = await getPostsByTagName(tagname)

    const posts = allPosts.filter(post => {
      return post.active || (req.user && post.author.id === req.user.id);
    })
    // send out an object to the client { posts: // the posts }
    res.send({ posts: posts })
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message })
  }
});

module.exports = tagsRouter;