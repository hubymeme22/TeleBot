////////////////////////////
//  Just display designs  //
////////////////////////////
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
		document.getElementById(`functionality-${title}`).onclick = () => {};
	}, 300);
}

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
		document.getElementById(`functionality-${title}`).onclick = () => {}
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
properties = buttons[0]
botlist    = buttons[1]
addbot     = buttons[2]
about      = buttons[3]
contribute = buttons[4]

botlist.onclick = () => { window.location.replace('bot-list.html'); }
about.onclick = () => { window.location.replace('about.html'); }
contribute.onclick = () => { window.location.replace('contribute.html'); }

proceed.onclick = () => {
	window.location.replace('#basics');
};