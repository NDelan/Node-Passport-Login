// '/dashboard' goes here to this file

const express = require('express');
// allow us to define and manage routes separately from the main application.
const router = express.Router();

const {ensureAuthenticated} = require('../config/auth');

router.get('/', (req, res) => {
    // res.send('Welcome');
    res.render('welcome');
});

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
}));

//This line exports the router instance as a module,
//making it available to other parts of the application
module.exports = router;