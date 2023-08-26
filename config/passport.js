const LocalStrategy = require('passport-local').Strategy; // Import Passport's local authentication strategy
const mongoose = require('mongoose'); // Import Mongoose for database operations
const bcrypt = require('bcryptjs'); // Import bcrypt library for password hashing

// Load User Model (import the User model from '../models/User')
const User = require('../models/User');

// Export the function that configures Passport with the LocalStrategy
module.exports = function(passport) {
    // Configure the LocalStrategy
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Find a user with the given email in the User collection
            User.findOne({email: email})
                .then(user => {
                    // If no user is found with the given email
                    if(!user) {
                        return done(null, false, {message: 'That email is not registered'});
                    }

                    // Compare the provided password with the hashed password stored in the user document
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        // If passwords match
                        if (isMatch) {
                            return done(null, user); // Authenticate the user
                        } else {
                            return done(null, false, {message: 'Password incorrect'}); // Password doesn't match
                        }
                    }); 
                })
                .catch(err => console.log(err)); // Handle errors, if any

        })
    );

    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });

    // passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => {
    //         done(err, user);
    //     });
    // });

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
          cb(null, { id: user.id, name: user.name });
        });
    });
      
    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}