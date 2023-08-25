const express = require('express');
// provides support for using layouts with EJS (Embedded JavaScript) templates.
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
const flash = require('connect-flash'); //Display flash message: stored temporarily in the server's memory 
                                        //and are displayed to the user after a certain event
const session = require('express-session'); // creates a session object for each user and stores session data on the server side,in memory or in a database, 
                                            //and associates a unique session ID with each user's session.

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
    resave: true, // forces the session to be saved back to the session store. Ensures that the session is saved in each response
    saveUninitialized: true // allows a new session to be created if the session is new and not modified.
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