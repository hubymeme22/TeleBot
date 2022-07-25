// This bot warns user if he/she used the word in the group
// the specific word can be added by command : /ban <word-to-ban>

// The bot also deletes the original message, messages the old message
// to the group with the banned word replaced with asterisk alongside
// with the warning

// By: Hubert F. Espinola I

const id_word_map = {
	// chat_id : [banned_words]
};

function banWord(bot_instance, msg, match) {
	const word = match[1];

	// check if this chat room is new
	if (!id_word_map.hasOwnProperty(msg.chat.id)) {
		// add listener to this chatroom
		id_word_map[msg.chat.id] = [];
		bot_instance.on('message', (cli_msg) => {
			for (let i = 0; i < id_word_map[msg.chat.id].length; i++) {
				if (cli_msg.text.includes(id_word_map[msg.chat.id][i])) {
					bot_instance.sendMessage(cli_msg.chat.id, 'A banned word is used, warning is given to the user.');
					break;
				}
			}
		});
	}

	// add the word to chatroom's banned wordlist
	if (id_word_map[msg.chat.id].indexOf(word) == -1) {
		id_word_map[msg.chat.id].push(word);
		bot_instance.sendMessage(msg.chat.id, 'Word is added to banned word list.');
	} else {
		bot_instance.sendMessage(msg.chat.id, 'The word you are trying to add is already on the list.')
	}
}

function unbanWord(bot_instance, msg, match) {
	const word = match[1];
	if (!id_word_map.hasOwnProperty(msg.chat.id)) {
		bot_instance.sendMessage(msg.chat.id, 'You have not banned a single word yet');
		return;
	}

	if (id_word_map[msg.chat.id].indexOf(word) == -1) {
		bot_instance.sendMessage(msg.chat.id, 'The word you are trying to ban does not exist in the wordlist');
		return;
	}

	id_word_map[msg.chat.id].pop(word);
	bot_instance.sendMessage(msg.chat.id, 'The word is removed from the list');
}

module.exports = {
	'ban' : banWord,
	'unban' : unbanWord
}