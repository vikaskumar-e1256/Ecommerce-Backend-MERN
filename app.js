const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const app = express(); 
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoute.js');
const userRoutes = require('./routes/userRoute.js');

// PORT
const port = process.env.PORT || 8000;

// DB
const URI = process.env.MONGODB_URL;

mongoose.connect(URI)
.then((res) => {
	console.log("Database connected");
}).catch(error => {
 	console.log(error);
});

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// Route Middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);

// Listing
app.listen(port, () => {
	console.log(`Server is running at ${port}`);
}); 