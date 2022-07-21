const Axios = require('axios');
const fs = require('fs');

const BotList = require('./BotMap/bot_map.json');
const BotHandler = require('./BotHandler');

const botInstanceMap = {};


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
		return {code : 'nonexistent_bot'};

	// update the list
	BotList[token].functionalities.push(function_name);
	updateList();

	// when bot is online
	if (botInstanceMap[token] != undefined)
		return {code: botInstanceMap[token].useFunction(function_name)};

	return {code : true};
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
	// make sure that there's only one instance running
	// for this bot token
	if (BotList[token].status === 'open' || botInstanceMap[token] != undefined)
		return ['already_running'];

	// make sure that the bot exists
	if (BotList[token] == undefined)
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
		const status = botInstanceMap[token].useFunction(item);
		run_log.push(status);
	});

	// run bot_instance
	botInstanceMap[token].startBot();
	BotList[token].status = 'open';
	updateList();

	return run_log;
}

function stopBot(token) {
	if (botInstanceMap[token] == undefined)
		return false;

	botInstanceMap[token].stopBot();
	delete botInstanceMap[token];

	BotList[token].status = 'close';
	updateList();

	return true;
}

// for loading the running previous bots
function loadRunningBots() {
	Object.entries(BotList).map(item => {
		if (item[1].status == 'open' && item[0] != 'sample_bot_token') {
			console.log('[Bot continuous load] Status open for ' + item[0]);

			// retrieve functions for this bot
			const token = item[0];
			const bot_functions = BotList[token].functionalities;

			// execute and run these functions
			// make bot_instance
			botInstanceMap[token] = new BotHandler(token, bot_functions);

			// run bot_instance
			botInstanceMap[token].startBot();
			updateList();
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
	'findToken' : findTokenByUsername,
	'stopBot' : stopBot
};