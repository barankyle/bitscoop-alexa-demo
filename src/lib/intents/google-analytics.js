'use strict';

const assert = require('assert');


module.exports = function() {
	let bitscoop = global.env.bitscoop;

	try {
		assert(process.env.GOOGLE_GA_VIEW_ID != null, 'Google Analytics view configuration cannot be `null`.');
	} catch(err) {
		return Promise.resolve('Google is missing some important configuration parameters.');
	}

	try {
		assert(process.env.GOOGLE_CONNECTION_ID != null, 'Google Analytics connection ID cannot be `null`.');
	} catch(err) {
		return Promise.resolve('Google is missing some important configuration parameters.');
	}

	let map = bitscoop.map(process.env.GOOGLE_MAP_ID);
	let cursor = map.endpoint('Metrics').method('GET');

	return cursor({
		headers: {
			'X-Connection-Id': process.env.GOOGLE_CONNECTION_ID
		},
		query: {
			view_id: process.env.GOOGLE_GA_VIEW_ID
		}
	})
		.then(function(result) {
			let [data] = result;

			let totals = data.totalsForAllResults;

			let response = 'There were ' + totals['ga:users'] + ' visitors to the site in the last 24 hours, and ' + totals['ga:newUsers'] + ' were new visitors.';

			return Promise.resolve(response);
		})
		.catch(function() {
			return Promise.resolve('I ran into some issues reaching Google Analytics.');
		});
};
