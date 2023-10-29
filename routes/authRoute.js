const express = require('express');
const router = express.Router();

// Import Controller
const { signup, signin, signout, requireSignin } = require('../controllers/authController.js');
const { userSignupValidator, userSigninValidator } = require('../validator/index.js');

router.post ('/signup', userSignupValidator, signup);
router.post ('/signin', userSigninValidator, signin);
router.get ('/signout', signout);

module.exports = router;