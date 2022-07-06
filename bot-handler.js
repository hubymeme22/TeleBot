const Axios = require('axios');
const BotList = require('./BotMap/bot_map.json');
const fs = require('fs');

// returns the bot status
function checkBot(token='', callback=(data) => {}) {
	Axios.get(`https://api.telegram.org/bot${token}/getMe`)
		.then(response => {
			callback(response.data);
		})

		.catch(error => {
			callback(error.response.data);
		});
}

// adds this specified bot to the list
function addToken(token) {
	if (BotList[token] == undefined || BotList[token] == null) {

		// set the default bot properties
		BotList[token] = {
			"functionalities" : {},
			"object" : {},
			"status" : "close"
		}

		// update the botlist
		fs.writeFile('./BotMap/bot_map.json', JSON.stringify(BotList, null, 2), (error) => {
			if (error) console.error(error);
		});

		const response = {};
		response[token] = BotList[token];

		return response;
	}

	return {};
}

module.exports = {
	'checkBot' : checkBot,
	'addToken' : addToken
};