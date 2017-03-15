'use strict';

const https = require('https');

const Promise = require('bluebird');
const _ = require('lodash');
const config = require('config');
const httpErrors = require('http-errors');

const callBitscoop = require('../../lib/util/call-bitscoop');


let endingPunctuation = new Set([
	'.',
	'!',
	'?'
]);

module.exports = function() {
	return new Promise(function(resolve, reject) {
		callBitscoop({
			method: 'GET',
			path: '/' + config.github.mapId + '/TrendingRepositories',
			headers: {
				Authorization: 'Bearer ' + config.bitscoop.key
			},
			query: {
				sort: 'stars',
				order: 'desc'
			}
		}, function(err, response, body) {
			if (err || response.statusCode !== 200) {
				reject(err || httpErrors(404));
			}
			else {
				var responseString = '';

				_.each(body, function(item) {
					let newItem = item.name + '. <break/> ';

					if (item.description) {
						let description = item.description;
						let lastChar = description.slice(-1);

						if (!endingPunctuation.has(lastChar)) {
							description += '. ';
						}
						else {
							description += ' ';
						}

						newItem += description;
					}
					else {
						newItem += 'No description recorded. ';
					}

					responseString += '<p>' + newItem + '</p>';
				});

				resolve(responseString);
			}
		});
	})
};
