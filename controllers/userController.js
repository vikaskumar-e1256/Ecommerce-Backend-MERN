const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler.js');


exports.userById = (req, res, next, id) => {
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'User not found'
        });
      }
      req.profile = user;
      next();
    })
    .catch(err => {
      // Handle any errors that may occur during the query
      console.error(err);
      return res.status(500).json({
        error: 'Internal server error'
      });
    });
};


