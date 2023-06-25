const Users = require('../users/users-model.js')

function logger(req, res, next) {
  const timestamp = new Date().toLocaleTimeString()
  console.log({
    method: req.method,
    url: req.url,
    timestamp: timestamp
  })
  next()
}

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params
  const possibleFoundUser = await Users.getById(id)
  if (!possibleFoundUser) {
    res.status(404).json({ message: "user not found" })
    next()
  } else {
    req.user = possibleFoundUser
    next();
  }
  } catch (err) {
    res.status(500).json({
      message: 'problem finding user xD'
    })
  }
}

function validateUser(req, res, next) {
  const { name } = req.body
    if (!name || !name.trim()) {
      res.status(400).json({ message: "missing required name field", })
      next();
    } else {
      req.name = name.trim()
      next();
    }
  }

function validatePost(req, res, next) {
  const { text } = req.body
  if (!text || !text.trim()) {
    res.status(400).json({ message: "missing required text field" })
    next();
  } else {
    req.text = text.trim()
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validatePost,
  validateUser,
  validateUserId
}