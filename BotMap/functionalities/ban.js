// This bot warns user if he/she used the word in the group
// the specific word can be added by command : /ban <word-to-ban>

// The bot also deletes the original message, messages the old message
// to the group with the banned word replaced with asterisk alongside
// with the warning

// By: Hubert F. Espinola I

function banWord(bot_instance, msg, match) {
	const word = match[1];
	console.log(`banned word: ${word}`);

	// soon here...
}

module.exports = {
	'ban' : banWord
}