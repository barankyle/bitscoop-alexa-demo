'use strict';


const Alexa = require('alexa-sdk');
const Promise = require('bluebird');

const githubTrendingRepos = require('./src/github-trending-repos/index');


const skillName = 'BitScoop';


var handlers = {
	GitHubIntent: function () {
		let self = this;

		new Promise(function(resolve, reject) {
			githubTrendingRepos()
				.then(function(result) {
					resolve(result);
				})
				.catch(function(err) {
					resolve('There was a problem executing your request; please try again. If this persists, try again later, or let email us via support@bitscoop.com.')
				});
		})
			.then(function(speechOutput) {
				self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
			});
	},

	AboutIntent: function () {
		var speechOutput = 'BitScoop Labs is an Orange County, California-based company that develops API integration products.';
		this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
	},

	'AMAZON.HelpIntent': function () {
		var speechOutput = '';

		speechOutput += 'Here are some things you can say: ';
		speechOutput += 'Get me the repos trending on GitHub. ';
		speechOutput += 'Tell me what\'s trending on GitHub. ';
		speechOutput += 'You can also say stop if you\'re done. ';
		speechOutput += 'So how can I help?';
		this.emit(':ask', speechOutput, speechOutput);
	},

	'AMAZON.StopIntent': function () {
		var speechOutput = 'Goodbye';
		this.emit(':tell', speechOutput);
	},

	'AMAZON.CancelIntent': function () {
		var speechOutput = 'Goodbye';
		this.emit(':tell', speechOutput);
	},

	LaunchRequest: function () {
		let speechText = '';

		speechText += 'Welcome to ' + skillName + '.  ';
		speechText += 'You can ask a question like, get me the repos trending on GitHub. ';
		var repromptText = 'For instructions on what you can say, please say help me.';
		this.emit(':ask', speechText, repromptText);
	}

};

exports.handler = function (event, context) {
	var alexa = Alexa.handler(event, context);
	alexa.APP_ID = 'amzn1.ask.skill.02c24eba-6b0f-424c-8452-a24e7ead69ce';
	alexa.registerHandlers(handlers);
	alexa.execute();
};
