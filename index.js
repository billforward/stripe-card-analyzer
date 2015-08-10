var config = require('./config/config')
var stripe = require('stripe')(config.stripeAPIKey);

stripe.accounts.listExternalAccounts(
	config.stripeManagedAccount,
	{
		object: "card"
	})
	.then(console.log);