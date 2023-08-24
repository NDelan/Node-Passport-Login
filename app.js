const express = require('express');
// provides support for using layouts with EJS (Embedded JavaScript) templates.
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
const flash = require('connect-flash'); //Display flash message
const session = require('express-session');

const app = express();


// DB config: connects to database
const db = require('./config/keys').MongoURI;

// connnect to mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//EJS
//necessary to configure Express application correctly for using EJS templates
//with layout support. They ensure that you can efficiently manage views while maintaining
//a consistent and organized structure across your web application.

app.use(expressLayouts);
//sets the default view engine for rendering templates to EJS.
//When you specify 'ejs' as the view engine, you can omit the file extension 
//when rendering templates with the res.render() method.
app.set('view engine', 'ejs');

//BodyParser
//parses the data and makes it available in the req.body object so that 
//it can be accessed in the submitted form fields and their values in the route handlers.
app.use(express.urlencoded({ extended: false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  }));

//Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
//define middleware that should be applied to a specific route.
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//If there's no PORT environment variable defined, 
//the code will default to using port 5000
const PORT = process.env.PORT || 5000;

//starts your server application and makes it listen for incoming requests
// on the specified port number (PORT)
app.listen(PORT, console.log(`Server started on port ${PORT}`));