// This bot warns user if he/she used the word in the group
// the specific word can be added by command : /ban <word-to-ban>

// The bot also deletes the original message, messages the old message
// to the group with the banned word replaced with asterisk alongside
// with the warning

// By: Hubert F. Espinola I

function banWord(bot_instance, msg, match) {
	const word = match[1];
	console.log(`banned word: ${word}`);

	// send notification to client:
	bot_instance.sendMessage(msg.chat.id, `word *${word}* added to banned word list`);

	// callback added for listening incoming messages
	bot_instance.on('message', (message) => {
		console.log('Bot message logging is called');
		if (message.text.includes(word) && message.chat.id == msg.chat.id)
			bot_instance.sendMessage(message.chat.id, 'That word is banned! warning is given to you');
	});

}

module.exports = {
	'ban' : banWord
}