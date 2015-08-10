var fs = require('fs');

var _ = require('lodash');
var configNominal = require('./config/config.example');
var configBespoke = require('./config/config');
var config = _.extend({}, configNominal, configBespoke);

var FastSet = require("collections/fast-set");

var util = require('util');

var Promise = require('bluebird');

var stripe = require('stripe')(config.stripeAPIKey);
stripe.setApiVersion('2015-07-13');

var lineReader = require('line-reader');

var outgoingPromises = [];

var servicedCustomers = new FastSet();

function induce(callback) {
	callback(config.readAllLines || ++linesRead < config.linesToRead);
};

function reducePromiseBuffer(callback) {
	Promise.all(outgoingPromises)
	.then(function(tuples) {
		console.log("Serializing batch…");
		var mappedResults = _.map(tuples, function(tuple) {
			var result = tuple.result;
			var cardsSet = result.data;
			var customerID = tuple.customerID;

			console.log(util.format(
				"Customer '%s' has %d cards.",
				customerID,
				cardsSet.length));
			if(result.has_more) {
				console.warn(util.format(
					"Customer '%s' has more cards than were returned in the query (which showed only %d)!",
					customerID,
					cardsSet.length
					));
			}

			var cardStrings = _.reduce(cardsSet, function(accumulator, card) {
				var fields = _.map(config.cardFields, function(field) {
					return card[field];
				})
				var serializedIterand = fields.join(config.columnDelimiter);
				console.log(util.format("Found card (%s).", fields.join(", ")));
				return accumulator.concat(serializedIterand);
			}, []);
			return cardStrings.join(config.lineDelimiter);
		});
		var fileAppend = mappedResults.join(config.lineDelimiter)+config.lineDelimiter;
		fs.appendFile(config.outputFile, fileAppend, function (err) {
			if (err) {
				throw err;
			}
		});
		outgoingPromises = [];
		induce(callback);
	});
};

if (fs.statSync(config.outputFile)) {
	fs.truncateSync(config.outputFile);
}

// function withNextPage(id, cursor) {

// }

var linesRead = 0;
lineReader.eachLine(config.inputFile, function eachLine(line, last, callback) {
	var customerID = line;
	if (servicedCustomers.has(customerID)) {
		return callback(true);
	}
	servicedCustomers.add(customerID);

	console.log(util.format("Requesting cards for customer '%s'…", customerID));
	outgoingPromises.push(stripe.customers.listCards(customerID)
		// .then(function(result) {
		// 	console.log(result);
		// 	if (result.has_more) {
		// 		return result.concat
		// 	}
		// 	return result;
		// })
	.then(function(result) {
		return {
			result: result,
			customerID: customerID
		};
	})
		);
	if (outgoingPromises.length >= config.promiseBatchSize) {
		return reducePromiseBuffer(callback);
	}
	return induce(callback);
})
.then(function allLinesDone() {
	reducePromiseBuffer(function() {});
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