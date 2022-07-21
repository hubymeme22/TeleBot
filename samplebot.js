const BotHandler = require('./BotHandler');

const botInstances = {};
botInstances['samplebot1'] = new BotHandler('5501404508:AAE_DCVb-3vb2IjfHh4vSpCaGpddrV4Jcdw', ['echo']);
botInstances['samplebot1'].startBot();

setTimeout(() => {
	botInstances['samplebot1'].stopBot();
	console.log(delete botInstances['samplebot1']);

	botInstances['samplebot1'] = new BotHandler('5501404508:AAE_DCVb-3vb2IjfHh4vSpCaGpddrV4Jcdw', ['echo']);
	botInstances['samplebot1'].startBot();
}, 10000);