process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const CallbackMap = require('./BotMap/callbacks.json');

class BotHandler {
	constructor(token='', callback_list=[]) {
		this.botObj = new TelegramBot(token, {polling : true});
		this.callbacks = [];

		callback_list.forEach((keyword) => {
			console.log(`Using function : ${keyword}`);
			const module = require(`./BotMap/${CallbackMap[keyword]}`);
			this.useFunction(module);
		});
	}

	useFunction(keyword='') {
		if (CallbackMap[keyword] != undefined) {
			const module = require(`./BotMap/${CallbackMap[keyword]}`);
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

	stopBot() {
		this.botObj.stopPolling();
	}
}

module.exports = BotHandler;