// api/posts.js
const express = require('express');
const getAllPosts = require('../db/posts/getAllPosts');
const { requireUser } = require('./utils');
const createPost = require('../db/posts/createPost')
const updatePost = require('../db/posts/updatePost')
const getPostById = require('../db/posts/helper/getPostById')



const postsRouter = express.Router();


postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");
  next()
});

postsRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();

    const posts = allPosts.filter(post => {
      return post.active || (req.user && post.author.id === req.user.id);
    });

    res.send({
      posts
    });
  } catch ({ name, message }) {
    next({ name, message })
  }

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

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {

      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? {
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2MTkzODgyNDZ9.MMd8E4F0AneSOvjTjkEYju_gBV_e0BW5gqFDbCr6RgQ
module.exports = postsRouter;