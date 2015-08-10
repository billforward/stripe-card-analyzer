var config = require('./config/config')
var stripe = require('stripe')(config.stripeAPIKey);
