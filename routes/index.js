// '/dashboard' goes here to this file

const express = require('express');
// allow us to define and manage routes separately from the main application.
const router = express.Router();

router.get('/', (req, res) => {
    // res.send('Welcome');
    res.render('welcome');
});

//This line exports the router instance as a module,
//making it available to other parts of the application
module.exports = router;