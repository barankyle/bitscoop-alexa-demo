'use strict';

const assert = require('assert');


module.exports = function() {
	let bitscoop = global.env.bitscoop;

	try {
		assert(process.env.GITHUB_USER != null, 'GitHub user configuration cannot be `null`.');
	} catch(err) {
		return Promise.resolve('GitHub is missing some important configuration parameters.');
	}

	try {
		assert(process.env.GITHUB_REPO != null, 'GitHub repository configuration cannot be `null`.');
	} catch(err) {
		return Promise.resolve('GitHub is missing some important configuration parameters.');
	}

	let map = bitscoop.map(process.env.GITHUB_MAP_ID);
	let cursor = map.endpoint('Issues').method('GET');

	return cursor({
		query: {
			user: process.env.GITHUB_USER,
			repo: process.env.GITHUB_REPO
		}
	})
		.then(function(result) {
			let [data] = result;

			let response = 'There are ';

			if (data.length === 100) {
				response += 'at least ';
			}

			response += data.length + ' open issues for your project.';

			return Promise.resolve(response);
		})
		.catch(function() {
			return Promise.resolve('I ran into some issues reaching GitHub.');
		});
};
