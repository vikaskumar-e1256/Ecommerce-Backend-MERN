const express = require('express');
const router = express.Router();

// Import Controller
const { requireSignin, isAuth, isAdmin } = require('../controllers/authController.js');
const { userById } = require('../controllers/userController.js');

router.get('/profile/:userid', requireSignin, isAuth, (req, res) => {
	res.json({
		user: req.profile
	});
});
router.param ('userid', userById);

module.exports = router;