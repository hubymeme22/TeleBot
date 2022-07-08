const Axios = require('axios');
const fs = require('fs');

const BotList = require('./BotMap/bot_map.json');
const CallbackMap = require('./BotMap/callbacks.json');

////////////////////////
//  Bot Handler class //
////////////////////////
const botInstanceMap = {};
class BotHandler {
	constructor(token='', callback_list=[]) {
		this.botObj = null;
		this.callbacks = [];

		callback_list.forEach((item, index) => {
			if (CallbackMap[item] != undefined) {
				const module = require(`./BotMap/${CallbackMap[item]}`);
				this.callbacks.push(module);
			}
		});
	}
}

// updates the bot list
function updateList() {
		// update the botlist
		fs.writeFile('./BotMap/bot_map.json', JSON.stringify(BotList, null, 2), (error) => {
			if (error) console.error(error);
		});
}

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
			"functionalities" : [],
			"object" : {},
			"status" : "close"
		};
		updateList();

		const response = {}; response[token] = BotList[token];
		return response;
	}

	return {};
}

// for adding bot functionality
function addFunction(token, json_data={}) {
	if (BotList[token] != null || BotList[token] != undefined) {
		BotList[token].functionalities = json_data;
		return 'success';
	}

	return 'used_token';
}

// for running the bot and executing functions
function startBot(token) {
	if (BotList[token] != null || BotList[token] != undefined) {
		// retrieve functions for this bot
		const bot_functions = BotList[token].functionalities;
		const run_log = [];

		// execute and run these functions
		// make bot_instance
		bot_functions.forEach((item, idx) => {
			// check item string and
			// bot_instance add_function: item
		});

		// run bot_instance
		return run_log;
	}

	return [];
}

module.exports = {
	'checkBot' : checkBot,
	'addToken' : addToken,
	'addFunction' : addFunction,
	'startBot' : startBot
};