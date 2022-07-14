////////////////////////////////
//  card appearance designer  //
////////////////////////////////
const bot_container = document.getElementById('bot_container');
let botIDTracker = 1;
let cardList = {
	// card_1 : {
	// 	'start'  : document.getElementById('start-button-1'),
	// 	'delete' : [document.getElementById('del-button-1'), '1'],
	// 	'info'   : [document.getElementById('info-button-1'), {
	// 		token : '',
	// 		nickname : '',

	// 	}]
	// }
};

function addBot(nickname, statusJSONData) {
	let newNickname = nickname;
	if (nickname.length > 8)
		newNickname = nickname.slice(0, 5) + '...';

	if (botIDTracker == 1)
		bot_container.innerText = '';

	const html_content = `
		<div class="card expand-downwards">
		<div class="profile"></div>
		<div class="info">
			<button class="info-button start-info-button" id="start-button-${botIDTracker}"></button>
			<p class="info-name" id="nname_${botIDTracker}">${newNickname}</p>

			<button class="info-button del-info-button" id="del-button-${botIDTracker}"></button>
			<button class="info-button more-bot-info" id="info-button-${botIDTracker}"></button>
		</div>
		</div>`;

	bot_container.innerHTML += html_content;
	setTimeout(() => {

		// update the cardlist
		const botID = `card_${botIDTracker}`;
		cardList[botID] = {};
		cardList[botID]['start']  = document.getElementById(`start-button-${botIDTracker}`);
		cardList[botID]['delete'] = document.getElementById(`del-button-${botIDTracker}`);
		cardList[botID]['info']   = [document.getElementById(`info-button-${botIDTracker}`), statusJSONData];

		// update the botlist
		const botStatus = cardList[botID]['info'][1].status;
		if (botStatus == 'open') {
			cardList[botID]['start'].classList.remove('start-info-button');
			cardList[botID]['start'].classList.add('start-info-button-started');
		} else {
			cardList[botID]['start'].classList.remove('start-info-button-started');
			cardList[botID]['start'].classList.add('start-info-button');
		}


		// add the button definitions
		cardList[botID]['start'].onclick = () => {
			// checks the current status
			const botStatus = cardList[botID]['info'][1].status;
			console.log(botStatus);
			if (botStatus === 'open') {
				cardList[botID]['start'].classList.remove('start-info-button-started');
				cardList[botID]['start'].classList.add('start-info-button');
				cardList[botID]['info'][1].status = 'close';
			} else {
				cardList[botID]['start'].classList.remove('start-info-button');
				cardList[botID]['start'].classList.add('start-info-button-started');
				cardList[botID]['info'][1].status = 'open';
			}
		};

		cardList[botID]['delete'].onclick = () => {

		};

		botIDTracker++;
	}, 500);
}

function retrieveBot() {
	packedRequest_GET(window.location.origin + '/bot_list', (type, response) => {
		if (type != 'reponse') return;

		// save the bot list to localStorage
		const parsed_data = JSON.stringify(parsed_data);
		window.localStorage.setItem('bot_list', parsed_data);

		// 
	});
}

////////////////////////////////
//  Submit button definition  //
////////////////////////////////
const addbotinfo = document.getElementById('add_bot');
const close_tsection = document.getElementById('close_token_section');
const submit_bot = document.getElementById('start-bot-token');

addbotinfo.onclick = () => {
	document.getElementById('token-section').classList.remove('fade-out');
	document.getElementById('token-section').classList.add('fade-in');
	document.getElementById('token-section').style.display = '';
};

close_tsection.onclick = () => {
	document.getElementById('token-section').classList.remove('fade-in');
	document.getElementById('token-section').classList.add('fade-out');
	setTimeout(() => { document.getElementById('token-section').style.display = 'none'; }, 500);

	document.getElementById('input-bot-token').value = '';
	document.getElementById('submit_status').innerHTML = '';
};

submit_bot.onclick = () => {
	const logs = document.getElementById('submit_status');
	const token = document.getElementById('input-bot-token').value;

	logs.innerText = 'Checking bot token...';
	packedRequest_GET(window.location.origin + `/check_token/${token}`, (type, response) => {
		if (!response.ok) {
			logs.innerHTML += ' [<b class="text-red">Failed</b>]';
			return;
		}

		// saves the token to the local files
		logs.innerHTML += ' [<b class="text-green">Good</b>]';
		const nickname = response.result.username;
		packedRequest_POST(window.location.origin + `/add_token/${token}`, response, (type, response) => {
			logs.innerHTML += '<br>Saving bot to server...';
			if (type != 'response') {
				logs.innerHTML += ' [<b class="text-red">Failed</b>]';
				return;
			}

			if (!response.repeat) {
				logs.innerHTML += ' [<b class="text-green">Good</b>]';
				addBot(nickname, response);
			} else {
				logs.innerHTML += ' [<b class="text-yellow">Already registered</b>]';
			}
		});

		// check if the user wants the bot to run
		const start_and_run = document.getElementById('sandr');
		if (!start_and_run.checked) {
			logs.innerHTML += '<br>Running bot... [<b class="text-yellow">Cancelled</b>]';
			return;
		}

		// runs the bot
		packedRequest_GET(window.location.origin + `/run/${token}`, (type, response) => {
			logs.innerHTML += '<br>Running bot...';
			if (type != 'response') {
				logs.innerHTML += ' [<b class="text-red">Failed</b>]';
				return;
			}

			if (response[0] == 'r_log') {
				logs.innerHTML += ' [<b class="text-green">Running</b>]'
				return;
			}

			if (JSON.stringify(response) == '["already_running"]') {
				logs.innerHTML += ' [<b class="text-yellow">Already Running</b>]'
				return;
			}

			if (response == []) {
				logs.innerHTML += ' [<b class="text-red">Bot Not Saved</b>]'
				return;
			}
		});
	});
};

/////////////////////////
//   web app startups  //
/////////////////////////

//////////////////////////////
//  button functionalities  //
//////////////////////////////
const buttons = document.getElementsByTagName('button');
const addbot_button = document.getElementById('add-bot');
const b_check = document.getElementById('token-check');

properties = buttons[0];
botlist    = buttons[1];
addbot     = buttons[2];
about      = buttons[3];
contribute = buttons[4];

// back to main interface
properties.onclick = () => { window.location.replace('app.html'); }
about.onclick = () => { window.location.replace('about.html'); }
contribute.onclick = () => { window.location.replace('contribute.html'); }