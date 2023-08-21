const express = require('express');

const app = express();

//If there's no PORT environment variable defined, 
//the code will default to using port 5000
const PORT = process.env.PORT || 5000;

//starts your server application and makes it listen for incoming requests
// on the specified port number (PORT)
app.listen(PORT, console.log(`Server started on port ${PORT}`));