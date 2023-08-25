// 'users/login', 'users/register' goes here

const express = require('express');
// allow us to define and manage routes separately from the main application.
const router = express.Router();
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
    // res.send('Login');
    res.render('login');
});

// Register Page
router.get('/register', (req, res) => {
    // res.send('Register');
    res.render('register');
});

//Register Handle
//handle incoming HTTP POST requests on a specific route path 
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];

    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please check in all fields'});
    }

    //Check passwords match
    if(password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    //Check password length
    if(password.length < 6) {
        errors.push({msg: 'Password length should be at least 6 characters'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation needed
        User.findOne({ email: email})
            //a promise handler that is executed when the asynchronous User.
            //findOne() operation is completed. It receives the retrieved user document 
            //(if found) as its argument.
            .then(user => {
                if(user) {
                  //User exists
                  errors.push({msg: 'Email is already registered'});
                  res.render('register', {
                    //By passing these variables to the view, the template can pre-fill the form fields 
                    //with the previously entered data. This helps users to correct any errors without having to 
                    //re-enter all the information.
                    errors,
                    name,
                    email,
                    password,
                    password2
                });  
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hash Password
                    
                    //generates a salt, a random string that is added to the user's password before hashing. 
                    //adds an extra layer of security to the hashing process. 
                    //The 10 parameter indicates the number of rounds of salting and hashing to perform. 
                    bcrypt.genSalt(10, (err, salt) =>   
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            //Set Password to hashed
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are successfully registered. You can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });
      }
});

//exports the router instance as a module,
//making it available to other parts of the application
module.exports = router;