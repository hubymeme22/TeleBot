////////////////////////////
//  Just display designs  //
////////////////////////////
let functionality_flag = 'echo';
let functionality_type = 'basic';

// Adds the "basic" functionality cards
function addBasic(title, callback_type_data) {
	const basic_container = document.getElementById('basic-container');
	const html_code = `
		<div class="card-wrapper center">
			<button class="cards" id="functionality-${title}">${title}</button>
		</div>`;

	// push the code inside the basic container
	basic_container.innerHTML += html_code;

	// define what the button can done
	setTimeout(() => {
		document.getElementById(`functionality-${title}`).onclick = () => {
			document.getElementById('func-title').innerText = title;
			functionality_flag = title;
			functionality_type = 'basic';

			const bg_container = document.getElementById('bg-container');
			bg_container.classList.remove('color-button-advanced');
			bg_container.classList.add('color-button-basic');

			const finfadder = document.getElementById('function-information-adder');
			finfadder.classList.remove('fade-out');
			finfadder.classList.add('fade-in');
			finfadder.style.display = 'flex';
		};
	}, 100);
}

// Adds the "advanced" functionality cards
function addAdvanced(title, callback_type_data) {
	const advanced_container = document.getElementById('advanced-container');
	const html_code = `
		<div class="card-wrapper center">
			<button class="cards cards-advanced" id="functionality-${title}">${title}</button>
		</div>`;

	// push the code inside the basic container
	advanced_container.innerHTML += html_code;

	// define what the button can done
	setTimeout(() => {
		document.getElementById(`functionality-${title}`).onclick = () => {
			document.getElementById('func-title').innerText = title;
			functionality_flag = title;
			functionality_type = 'advanced';

			const bg_container = document.getElementById('bg-container');
			bg_container.classList.remove('color-button-basic');
			bg_container.classList.add('color-button-advanced');

			const finfadder = document.getElementById('function-information-adder');
			finfadder.classList.remove('fade-out');
			finfadder.classList.add('fade-in');
			finfadder.style.display = 'flex';
		}
	}, 300);
}

function addContribution(title, callback_type_data) {
	const contribution_container = document.getElementById('contribution-container');
	const html_code = `
		<div class="card-wrapper center">
			<button class="cards cards-advanced" id="functionality-${title}">${title}</button>
		</div>`;

	// push the code inside the basic container
	contribution_container.innerHTML += html_code;

	// define what the button can done
	setTimeout(() => {
		document.getElementById(`functionality-${title}`).onclick = () => {
		}
	}, 300);
}

// resets the card preview to its original state
function resetInnerBox() {
	const specific_container = document.getElementById('specific-container');
	const container = document.getElementById('info-container');
	const bot_info_container = document.getElementById('bot-info-container');
	
	specific_container.classList.remove('fade-out');
	specific_container.classList.add('fade-in');

	container.classList.remove('fade-in');
	container.classList.add('fade-out');

	container.hidden = true;
	bot_info_container.hidden = true;
	specific_container.hidden = false;

	document.getElementById('second-title').innerText = '';
	document.getElementById('text-content').innerText = '';
}

// adds all the bots name and highlights the bot with the specified function
function addFuncList(bot_name, function_name) {
	const container = document.getElementById('add-bot-here');
	const button = document.createElement('button');

	// this means that this bot already has this functionality
	if (bot_list[bot_name].functionalities.indexOf(function_name) != -1)
		button.classList.add('list-selected');
	
	button.classList.add('bot-check');
	button.innerText = bot_name;
	button.onclick = () => {
		console.log(bot_list[bot_name].functionalities);

		if (bot_list[bot_name].functionalities.indexOf(function_name) == -1) {
			button.classList.add('list-selected');
			bot_list[bot_name].functionalities.push(function_name);
		} else {
			button.classList.remove('list-selected');
			bot_list[bot_name].functionalities.pop(function_name);
		}

	};
	container.appendChild(button);
}

// loads the bot's functionality status on each card
function loadFunctionalityData() {
	const bot_names = Object.keys(bot_list);
	bot_names.forEach(bot => {
		addFuncList(bot, functionality_flag);
	});
}

////////////////////////////////////////
//  Client-server communication part  //
////////////////////////////////////////
let bot_list = {};
let functionality_data = {};


function retrieveBots() {
	packedRequest_GET(window.location.origin + '/bot_list', (type, response) => {
		if (type != 'response') return;
		bot_list = response;
	});
}

function retrieveFunctionality() {
	packedRequest_GET(window.location.origin + '/function_list', (type, response) => {
		if (type != 'response') return;
		functionality_data = response;

		const functionality_names = Object.keys(response);
		functionality_names.forEach(name => {
			switch (response[name].type) {
				case 'basic':
					addBasic(name, response[name]);
					break;
				case 'advanced':
					addAdvanced(name, response[name]);
					break;
				case 'contribution':
					addContribution(name, response[name]);
					break;
			}
		});
	});
}

////////////////////////
//  web app startups  //
////////////////////////
retrieveBots();
retrieveFunctionality();

/////////////////////
//  Just buttons   //
/////////////////////
const buttons = document.getElementsByTagName('button')
const panel_button = document.getElementById('close-panel')

properties = buttons[0]
botlist    = buttons[1]
addbot     = buttons[2]
about      = buttons[3]
contribute = buttons[4]

botlist.onclick = () => { window.location.replace('bot-list.html'); }
about.onclick = () => { window.location.replace('about.html'); }
contribute.onclick = () => { window.location.replace('contribute.html'); }

proceed.onclick = () => { window.location.replace('#basics'); };
panel_button.onclick = () => {
	const section = document.getElementById('function-information-adder');
	section.classList.add('fade-out');

	setTimeout(() => {
		section.style.display = 'none';
		resetInnerBox();
	}, 300);
}

description.onclick = () => {
	const func_details = functionality_data[functionality_flag];
	const container = document.getElementById('info-container');
	const specific_container = document.getElementById('specific-container');

	// hide other selections
	specific_container.classList.remove('fade-in');
	specific_container.classList.add('fade-out');

	setTimeout(() => {
		document.getElementById('second-title').innerText = functionality_flag;
		document.getElementById('text-content').innerText = func_details.description;
	
		container.classList.remove('fade-out');
		container.classList.add('fade-in');
		container.hidden = false;	
		specific_container.hidden = true;
	}, 1000);
};

commands.onclick = () => {
	const func_details = functionality_data[functionality_flag];
	const container = document.getElementById('info-container');
	const specific_container = document.getElementById('specific-container');

	// hide other selections
	specific_container.classList.remove('fade-in');
	specific_container.classList.add('fade-out');

	setTimeout(() => {
		let command_format = '<ul>';
		func_details.commands.forEach((value, index) => {
			command_format += `<li>${value} - ${func_details.help[index]}</li>`;
		}); command_format += '</ul>';

		document.getElementById('second-title').innerText = 'Commands';

		// okay kids, this is dangerous, don't try this on ur company :>
		document.getElementById('text-content').innerHTML = command_format;

		container.classList.remove('fade-out');
		container.classList.add('fade-in');
		container.hidden = false;
		specific_container.hidden = true;
	}, 1000);
};

add.onclick = () => {
	// resets the bot list and re-loads again
	document.getElementById('add-bot-here').innerHTML = '';
	loadFunctionalityData();

	// fade out the other
	const container = document.getElementById('info-container');
	const specific_container = document.getElementById('specific-container');

	specific_container.classList.remove('fade-in');
	specific_container.classList.add('fade-out');
	container.classList.remove('fade-in');
	container.classList.add('fade-out');

	specific_container.hidden = true;

	// fades in the list now
	const bot_info_container = document.getElementById('bot-info-container');
	bot_info_container.classList.remove('fade-out');
	bot_info_container.classList.add('fade-in');
	bot_info_container.hidden = false;
};

const goBack = document.getElementById('goback-panel');
goBack.onclick = () => {
	const container = document.getElementById('info-container');
	const specific_container = document.getElementById('specific-container');

	container.classList.remove('fade-in');
	container.classList.add('fade-out');

	setTimeout(() => {
		specific_container.classList.remove('fade-out');
		specific_container.classList.add('fade-in');
		specific_container.hidden = false;

		container.hidden = true;
	}, 1000);
}