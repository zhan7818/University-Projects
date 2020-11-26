/* server.js - Express server*/
'use strict';
const log = console.log
log('Express server')

const express = require('express')
const app = express();

const path = require('path');

// Setting up a static directory for the files in /pub
// using Express middleware.
// Don't put anything in /pub that you don't want the public to have access to!
log('Debug Message')
app.use(express.static(__dirname +'/pub'))

const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 