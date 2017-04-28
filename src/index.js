'use strict';

const assert = require('assert');

const Alexa = require('alexa-sdk');
const BitScoop = require('bitscoop-sdk');

const intents = require('./lib/intents');


global.env = {
	name: 'BitScoop',
	bitscoop: new BitScoop(process.env.BITSCOOP_API_KEY)
};


// GITHUB_MAP_ID
// GITHUB_USER
// GITHUB_REPO

// GOOGLE_MAP_ID
// GOOGLE_GA_VIEW_ID
// GOOGLE_CONNECTION_ID

// STATUSCAKE_MAP_ID
// STATUSCAKE_TEST_ID

// POSTMAN_MAP_ID
// POSTMAN_MONITOR_ID


var handlers = {
	StackIntent: function() {
		let self = this;

		Promise.resolve()
			.then(function() {
				try {
					assert(process.env.BITSCOOP_API_KEY != null, 'Unspecified BitScoop API key.');
					assert(process.env.ALEXA_APP_ID != null, 'Unspecified Alexa app ID.');
				} catch(err) {
					return Promise.reject(err);
				}

				return Promise.resolve();
			})
			.then(function() {
				let promises = [];

				if (process.env.GOOGLE_MAP_ID) {
					promises.push(intents.googleAnalytics());
				}

				if (process.env.STATUSCAKE_MAP_ID) {
					promises.push(intents.statuscakeAlerts());
				}

				if (process.env.POSTMAN_MAP_ID) {
					promises.push(intents.postmanMonitor());
				}

				if (process.env.GITHUB_MAP_ID) {
					promises.push(intents.githubIssues());
				}

				if (promises.length === 0) {
					return Promise.resolve('But you haven\'t configured any status checks!');
				}

				return Promise.all(promises);
			})
			.then(function(results) {
				if (Array.isArray(results)) {
					//let response = '';

					//for (let i = 0; i < results.length; i++) {
					//	response += results[i];
					//
					//	if (i < results.length - 1) {
					//		response += ' <break/>';
					//	}
					//}

					let response = results.join(' ');

					return Promise.resolve(response);
				}

				return Promise.resolve(results);
			})
			.catch(function(err) {
				console.log(err);

				return Promise.resolve('There was a problem executing your request; please try again. If this persists, please try again later, or let us know at support@bitscoop.com.');
			})
			.then(function(message) {
				self.emit(':tellWithCard', message, global.env.name, message);
			});
	},

	AboutIntent: function () {
		let message = 'BitScoop Labs is an Orange County, California-based company that develops API integration products.';

		this.emit(':tellWithCard', message, global.env.name, message);
	},

	LaunchRequest: function () {
		let message = '';

		message += 'Welcome to ' + global.env.name + '.  ';
		message += 'You can ask a question like, get me the repos trending on GitHub. ';

		let reprompt = 'For instructions on what you can say, please say help me.';

		this.emit(':ask', message, reprompt);
	},

	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Goodbye');
	},

	'AMAZON.HelpIntent': function () {
		let message = '';

		message += 'Here are some things you can say: ';
		message += 'Get me the repos trending on GitHub. ';
		message += 'Tell me what\'s trending on GitHub. ';

		message += 'You can also say stop if you\'re done. ';
		message += 'So how can I help?';

		this.emit(':ask', message, message);
	},

	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Goodbye');
	}
};


exports.handler = function (event, context) {
	let alexa = Alexa.handler(event, context);

	alexa.APP_ID = process.env.ALEXA_APP_ID;

	alexa.registerHandlers(handlers);
	alexa.execute();
};
