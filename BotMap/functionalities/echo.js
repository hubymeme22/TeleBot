// A sample basic bot functionality: /echo
// By: Hubert F. Espinola I

function echoBack(bot_instance, msg, match) {
	bot_instance.sendMessage(msg.chat.id, match[1]);
}

module.exports = {
	'echo' : echoBack
}