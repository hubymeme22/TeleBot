process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
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
		this.botObj = new TelegramBot(token, {polling : true});
		this.callbacks = [];

		callback_list.forEach((item) => {
			this.useFunction(item);
		});
	}

	useFunction(keyword='') {
		if (CallbackMap[keyword] != undefined) {
			const module = require(`./BotMap/${CallbackMap[item]}`);
			this.callbacks.push(module);

			return true;
		}

		return false;
	}

	startBot() {
		this.callbacks.forEach((item) => {

			// let the bot use all the callbacks from the module
			const internalCallbackNames = Object.keys(item);
			internalCallbackNames.forEach((callbackName) => {

				console.log(`[BotHandler] Added function : ${callbackName}`);
				this.botObj.onText(new RegExp(`/${callbackName} (.+)`), (msg, match) => {
					item[callbackName](this.botObj, msg, match);
				});

			});
		});
	}
}


/////////////////////////////
//  TGFunctions (for API)  //
/////////////////////////////
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

		const response = {};response[token] = BotList[token];
		return response;
	}

	return {};
}

function addFunction(token, function_name) {
	if (BotList[token] == null || BotList[token] == undefined)
		return 'nonexistent_bot';

	if (botInstanceMap[token] == null || botInstanceMap[token] == undefined)
		return 'bot_not_started';

	return botInstanceMap[token].useFunction(function_name);
}

// sets the bot's function
function setFunction(token, func_arr=[]) {
	if (BotList[token] != null || BotList[token] != undefined) {
		BotList[token].functionalities = func_arr;
		return 'success';
	}

	return 'used_token';
}

// for running the bot and executing functions
function startBot(token) {
	if (BotList[token].status === 'open')
		return ['already_running'];

	if (BotList[token] == null || BotList[token] == undefined)
		return [];

	// retrieve functions for this bot
	const bot_functions = BotList[token].functionalities;
	const run_log = [];

	// execute and run these functions
	// make bot_instance
	botInstanceMap[token] = new BotHandler(token);
	bot_functions.forEach((item) => {
		// check item string and
		// bot_instance add_function: item
		const status = BotInstance.addFunction(item);
		run_log.push(status);
	});

	// run bot_instance
	botInstanceMap[token].startBot();
	botInstanceMap[token].status = 'open';
	updateList();

	return run_log;
}

module.exports = {
	'checkBot' : checkBot,
	'addToken' : addToken,
	'setFunction' : setFunction,
	'addFunction' : addFunction,
	'startBot' : startBot
};