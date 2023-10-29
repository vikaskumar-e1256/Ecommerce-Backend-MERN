const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler.js');


exports.signup = (req, res) => {
	const user = new User(req.body);
	user.save()
    .then(savedUser => {
    	savedUser.salt = undefined
    	savedUser.hashed_password = undefined
      return res.status(201).json({ user: savedUser });
    })
    .catch(err => {
      return res.status(400).json({ error: errorHandler(err) });
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'User with that email does not exist. Please sign up'
        });
      }
      // Now, check the password
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: 'Email and password do not match'
        });
      }
      // Generate a token and set it as a cookie
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie('t', token, { expire: new Date() + 9999 });
      // Return the user and token to the client
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, name, email, role } });
    })
    .catch(err => {
      // Handle any errors that might occur during the database query
      console.error(err);
      return res.status(500).json({
        error: 'Internal server error'
      });
    });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({message: 'Signout success'});
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied'
    });
  }
  next();
};













