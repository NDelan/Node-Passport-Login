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
            .then(user => {
                if(user) {
                  //User exists
                  errors.push({msg: 'Email is already registered'});
                  res.render('register', {
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

                    console.log(newUser);
                    res.send('hello')
                }
            });
      }
});

//This line exports the router instance as a module,
//making it available to other parts of the application
module.exports = router;