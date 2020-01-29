const { decodeToken } = require('../helpers/jwt'),
  User = require('../models/user'),
  Question = require('../models/question'),
  Answer = require('../models/answer')

function authenticate(req, res, next) {
  try {
    req.user = decodeToken(req.headers.token)
    // console.log(req.user);
    User.findById(req.user._id)
      .then(user => {
        if(!user){
          let err = new Error('AuthenticationFailed')
          err.status = 400
          err.message = 'Authentication failed'
          throw err
        } else {
          req.user = user
          next()
        }
      })
      .catch(next)
  } catch (error) {
    next(error)
  }
}

function userAuthorize(req, res, next) { // is this necesarry? I DONT THINK SO
  try {
    // console.log("INI ADALAH ID USER", req.params.id)
    User.findOne({_id: req.params.id})
      .then(user => {
        // console.log('USER NYA KETEMU GAAA?', user)
        if(!user){
          let err = new Error('NotFound')
          err.status = 404
          err.message = 'id not found'
          throw err
        } else if (user.id == req.user.id){
          next()
        } else {
          let err = new Error('AuthorizationFailed')
          err.status = 401
          err.message = 'Authorization failed'
          throw err
        }
      })
      .catch(next)
  } catch (err) {
    next(err)
  }
}

function questionAuthorize(req, res, next) {
  try {
    Question.findOne({_id: req.params.id})
      .then(answer => {
        if(!answer){
          let err = new Error('NotFound')
          err.status = 404
          err.message = 'id not found'
          throw err
        } else if (answer.author == req.user.id){
          next()
        } else {
          let err = new Error('AuthorizationFailed')
          err.status = 401
          err.message = 'Authorization failed'
          throw err
        }
      })
      .catch(next)
  } catch (err) {
    next(err)
  }
}

function answerAuthorize(req, res, next) {
  try {
    Answer.findOne({_id: req.params.id})
      .then(question => {
        if(!question){
          let err = new Error('NotFound')
          err.status = 404
          err.message = 'id not found'
          throw err
        } else if (question.author == req.user.id){
          next()
        } else {
          let err = new Error('AuthorizationFailed')
          err.status = 401
          err.message = 'Authorization failed'
          throw err
        }
      })
      .catch(next)
  } catch (err) {
    next(err)
  }
}

module.exports = { authenticate, userAuthorize, questionAuthorize, answerAuthorize }
