const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
const Users = require("./users-model.js");
const Posts = require("../posts/posts-model.js");
// The middleware functions also need to be required
const {
  logger,
  validatePost,
  validateUser,
  validateUserId,
} = require("../middleware/middleware.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const userArr = await Users.get();
  res.status(200).json(userArr);
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.post("/", validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid

  try {
    const newUser = await Users.insert({ name: req.body.name });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  try {
    const updatedUser = await Users.update(req.params.id, {
      name: req.body.name,
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  try {
    const deletedUser = await Users.getById(req.params.id);
    res.status(200).json(deletedUser);
    await Users.remove(req.params.id);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const createdPost = await Posts.insert({
        user_id: req.params.id,
        text: req.text,
      });
      console.log(createdPost);
      res.status(201).json(createdPost);
    } catch (err) {
      next(err);
    }
  }
);

router.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: "something tragic inside posts route happend",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
// do not forget to export the router
