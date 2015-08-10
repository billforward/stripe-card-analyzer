var _ = require('lodash');
var configNominal = require('./config/config.example');
var configBespoke = require('./config/config');
var config = _.extend({}, configNominal, configBespoke);

var stripe = require('stripe')(config.stripeAPIKey);
stripe.setApiVersion('2015-07-13');

var lineReader = require('line-reader');

var linesRead = 0;
lineReader.eachLine(config.inputFile, function(line, last, callback) {
  // stripe.
  console.log(line);
  callback(config.readAllLines || ++linesRead < config.linesToRead);
})
.then(function() {
});

// stripe.accounts.listExternalAccounts(
// 	config.stripeManagedAccount,
// 	{
// 		object: "card"
// 	})
// 	.then(console.log);

// stripe.accounts.list()
// .then(console.log);

// stripe.customers.list()
// .then(console.log);

// stripe.accounts.retrieve(
//   config.stripeManagedAccount)
// .then(console.log);