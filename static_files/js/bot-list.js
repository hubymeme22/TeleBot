let bot_count = 0;
let field_used = false;

// just switches the old class with new one
function replace_class(node, old_class, new_class) {
	node.classList.remove(old_class);
	node.classList.add(new_class);
}



// resets the old id
function reset_ids() {
	const profile = document.getElementById('profile');
	const bot_token = document.getElementById('token');
	const checker = document.getElementById('token-check');
	const bot_stats = document.getElementById('bot-stats');
	const username = document.getElementById('bot-user');
	const can_join = document.getElementById('bot-can-join');
	const can_read = document.getElementById('bot-can-read');

	profile.removeAttribute('id');
	bot_token.removeAttribute('id');
	bot_stats.removeAttribute('id');
	username.removeAttribute('id');
	can_join.removeAttribute('id');
	can_read.removeAttribute('id');
	checker.removeAttribute('id');
}



// pass the token inputted to the api server
function submit_bot_token() {
	// UI interface data
	const profile = document.getElementById('profile');
	const bot_token = document.getElementById('token');
	const bot_stats = document.getElementById('bot-stats');
	const username = document.getElementById('bot-user');
	const can_join = document.getElementById('bot-can-join');
	const can_read = document.getElementById('bot-can-read');
	const checker = document.getElementById('token-check')

	// check for bot token value
	if (bot_token.value === '') {
		alert('Please input a token');
		return;
	}

	// check token and run it
	packedRequest_GET(window.location.origin + `/check_token/${bot_token.value}`, (type, data) => {
		if (type === 'response') {
			if (data.ok) {

				bot_stats.innerText = 'Pending';
				username.innerText = data.result.username;
				can_join.innerText = data.result.can_join_groups;
				can_read.innerText = data.result.can_read_all_group_messages;

				replace_class(bot_stats, 'text-grey', 'text-yellow');
				replace_class(username, 'text-grey', 'text-white');
				replace_class(can_join, 'text-grey', 'text-white');
				replace_class(can_read, 'text-grey', 'text-white');

				checker.disabled = true;
				bot_token.readOnly = true;
				bot_count += 1;
				field_used = true;

				packedRequest_GET(window.location.origin + `/add_token/${bot_token.value}`, (type, data) => {
					if (type === 'response') {
						console.log(data);
					}

					reset_ids();
				});

			} else {

				bot_stats.innerText = 'Non-existent Bot';
				replace_class(bot_stats, 'text-grey', 'text-red');

			}
		} else {
			alert('An Error occured');
		}
	})

	// upper message part
	if ((bot_count > 0) && document.getElementById('no-bot').innerText.includes('Homie')) {
		const element = document.getElementById('no-bot');
		element.innerText = 'Bot List below';
		element.classList.remove('fade-in-upwards');

		setTimeout(() => { element.classList.add('fade-in-upwards') }, 500);
	}
}



// function for adding a bot-adder template
function add_bot_template() {
	if (!field_used) {
		alert('Please add a valid bot first before adding new');
		return;
	}

	const bot_template = '<div class="bot-instance expand-downwards"><div class="grid-container fade-in"><div class="grid1 center"><div class="profile" id="profile"></div></div><div class="grid2"><input id="token" class="token" type="text" placeholder="Enter Your bot token here to check..."><button id="token-check" class="token-check">></button></div><div class="grid-empty"></div><div class="grid3">Bot Status: <b id="bot-stats" class="text-grey bot-stats">Offline</b><br/>Bot Details:<br/><div class="details-container">Username: <b id="bot-user" class="bot-user text-grey">N/A</b><br/>Can Join Groups: <b id="bot-can-join" class="bot-can-join text-grey">N/A</b><br/>Can read all grp message: <b id="bot-can-read" class="text-grey bot-can-read">N/A</b></div><i class="material-icons delete" id="delete">delete</i></div><div class="grid-empty"></div></div></div>';
	const breaker = document.createElement('br');
	const root_node = document.createElement('div');
	const bot_tmp_container = document.getElementById('instance-container');

	// add the attributes to th(ese)is needed element/s
	root_node.classList.add('pseudoContainer');

	// add to their respective children
	root_node.innerHTML = bot_template;
	bot_tmp_container.appendChild(breaker);
	bot_tmp_container.appendChild(root_node);

	// wait for the page to refresh
	setTimeout(() => {
		document.getElementById('token-check').onclick = submit_bot_token;
	}, 500)
}


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

// if user wants to add a bot
addbot_button.onclick = add_bot_template
b_check.onclick = submit_bot_token