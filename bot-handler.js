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

	removeFunction(keyword='') {
		if (CallbackMap[keyword] != undefined) {
			const module = require(`./BotMap/${CallbackMap[item]}`);
			this.unloadModule(module);
			return true;
		}

		return false;
	}

	unloadModule(module) {
		let commands = Object.keys(module);
		module.forEach(items => {
			this.botObj.removeTextListener(new RegExp(`/${items} (.+)`));
		});
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
function addToken(token, checks={ok : false}) {
	if (BotList[token] == undefined || BotList[token] == null) {
		// double check the response
		if (!checks.ok) return {};

		// set the default bot properties
		BotList[token] = {
			"functionalities" : [],
			"info" : checks,
			"status" : "close"
		};
		updateList();

		const response = {};
		response['repeat'] = false;
		response[token] = BotList[token];
		return response;
	}

	const response = {};
	response['repeat'] = true;
	response[token] = BotList[token];

	return response;
}

function addFunction(token, function_name) {
	if (BotList[token] == null || BotList[token] == undefined)
		return 'nonexistent_bot';

	if (botInstanceMap[token] == null || botInstanceMap[token] == undefined)
		return 'bot_not_started';

	return botInstanceMap[token].useFunction(function_name);
}

// removes the added function
function removeFunction(token, function_name) {
	// check if the bot is runnning
	if (botInstanceMap[token] == undefined)
		return {status: 'not_running'};

	// check if the function is installed in this bot
	const botFunctionalities = BotList[token].functionalities;
	if (botFunctionalities.indexOf(function_name) == -1)
		return {status: 'not_added_function'};

	// remove the bot's functionality
	botInstanceMap[token].removeFunction(function_name);
	return {status: 'removed'};
}

// sets the bot's function/s
function setFunction(token, func_arr=[]) {
	if (BotList[token] != null || BotList[token] != undefined) {
		BotList[token].functionalities = func_arr;
		return 'success';
	}

	return 'used_token';
}

// finds token by username/nickname of the bot
function findTokenByUsername(username='') {
	let token = undefined;

	// will fix this to break out of loop soon ;__;
	Object.entries(BotList).map(item => {
		if (item[1].info.result != undefined) {
			const bot_username = item[1].info.result.username;
			if (bot_username === username) {
				token = item[0];
				return;
			}
		}
	});

	return token;
}

// for running the bot and executing functions
function startBot(token) {
	if (BotList[token].status === 'open' || botInstanceMap[token] != undefined)
		return ['already_running'];

	if (BotList[token] == null || BotList[token] == undefined)
		return [];

	// retrieve functions for this bot
	const bot_functions = BotList[token].functionalities;
	const run_log = ['r_log'];

	// execute and run these functions
	// make bot_instance
	botInstanceMap[token] = new BotHandler(token);
	bot_functions.forEach((item) => {
		// check item string and
		// bot_instance add_function: item
		const status = botInstanceMap[token].addFunction(item);
		run_log.push(status);
	});

	// run bot_instance
	botInstanceMap[token].startBot();
	BotList[token].status = 'open';
	updateList();

	return run_log;
}

// for loading the running previous bots
function loadRunningBots() {
	Object.entries(BotList).map(item => {
		if (item[1].status == 'open' && item[0] != 'sample_bot_token') {
			console.log('[Bot continuous load] Status open for ' + item[0]);
			startBot(item[0]);
		}
	});
}

loadRunningBots();
module.exports = {
	'checkBot' : checkBot,
	'addToken' : addToken,
	'setFunction' : setFunction,
	'addFunction' : addFunction,
	'startBot' : startBot,
	'removeFunction' : removeFunction,
	'findToken' : findTokenByUsername
};