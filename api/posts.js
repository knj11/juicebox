// api/posts.js
const express = require('express');
const getAllPosts = require('../db/posts/getAllPosts');
const { requireUser } = require('./utils');
const createPost = require('../db/posts/createPost')

const postsRouter = express.Router();


postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next()
});

postsRouter.get('/', async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts
  });

});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  //id is found on the user obj but we rename the var to authorId
  const { id: authorId } = req.user;
  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object
    postData.authorId = authorId
    postData.title = title
    postData.content = content

    const post = await createPost(postData);
    // this will create the post and the tags for us
    if (post) {
      res.send({ post })
    } else {
      next(new Error('Could not create new post'))
    }
    // if the post comes back, res.send({ post });
    // otherwise, next an appropriate error object 
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;