module.exports = {
	stripeAPIKey: 'your stripe API key',
	stripeManagedAccount: 'managed stripe account to consult',
	inputFile: './input/input.csv',
	outputFile: './output/output.csv',
	linesToRead: 1,
	readAllLines: true,
	promiseBatchSize: 10,
	lineDelimiter: '\n',
	columnDelimiter: ',',
	// queryRecordLimit: 10,
	cardFields: ["customer", "id", "brand", "funding"],
	sanitizer: function(string) {
		return string;
	}
};