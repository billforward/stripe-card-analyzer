var config = require('./config/config');
var stripe = require('stripe')(config.stripeAPIKey);
stripe.setApiVersion('2015-07-13');

// stripe.accounts.listExternalAccounts(
// 	config.stripeManagedAccount,
// 	{
// 		object: "card"
// 	})
// 	.then(console.log);

// stripe.accounts.list()
// .then(console.log);

stripe.customers.list()
.then(console.log);

// stripe.accounts.retrieve(
//   config.stripeManagedAccount)
// .then(console.log);