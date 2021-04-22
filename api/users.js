// api/users.js
const express = require('express');
const jwt = require('jsonwebtoken')
const getAllUsers = require('../db/users/getAllUsers.js');
const getUserByUsername = require('../db/users/getUserByUsername.js');

const usersRouter = express.Router();


usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next()
});

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
 
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      // create token & return to user
      const clientToken = jwt.sign({username: user, password: user,password}, process.env.JWT_SECRET)
      res.send({ message: "you're logged in!", token: clientToken });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;