'use strict';

const assert = require('assert');


module.exports = function() {
	let bitscoop = global.env.bitscoop;

	try {
		assert(process.env.POSTMAN_MONITOR_ID != null, 'Postman monitor configuration cannot be `null`.');
	} catch(err) {
		return Promise.resolve('Postman is missing some important configuration parameters.');
	}

	let map = bitscoop.map(process.env.POSTMAN_MAP_ID);
	let cursor = map.endpoint('RunMonitor').method('POST');

	return cursor({
		query: {
			monitor_id: process.env.POSTMAN_MONITOR_ID
		}
	})
		.then(function(result) {
			let [data] = result;

			if (data.run.stats.assertions.failed > 0) {
				return Promise.resolve('The API status check has failed.');
			}

			return Promise.resolve('The API status check has succeeded.');
		})
		.catch(function() {
			return Promise.resolve('I ran into some issues reaching Postman.');
		});
};
