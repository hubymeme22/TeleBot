const root_css = document.querySelector(':root');

local.onmouseover = () => {
	const cover_local = document.getElementById('cover-local');
	root_css.style.setProperty('--last_height_local', cover_local.offsetHeight.toString() + 'px');

	cover_local.classList.remove('card-up-local');
	cover_local.classList.add('card-down-local');

	local_label.style.display = 'block';
	local_label.classList.remove('fade-out');
	local_label.classList.add('fade-in');
};

local.onmouseout = () => {
	const cover_local = document.getElementById('cover-local');
	root_css.style.setProperty('--last_height_local', cover_local.offsetHeight.toString() + 'px');

	cover_local.classList.add('card-up-local');
	cover_local.classList.remove('card-down-local');

	local_label.classList.remove('fade-in');
	local_label.classList.add('fade-out');
};

git.onmouseover = () => {
	const cover_git = document.getElementById('cover-git');
	root_css.style.setProperty('--last_height_git', cover_git.offsetHeight.toString() + 'px');

	cover_git.classList.remove('card-up-git');
	cover_git.classList.add('card-down-git');

	git_label.style.display = 'block';
	git_label.classList.remove('fade-out');
	git_label.classList.add('fade-in');
};

git.onmouseout = () => {
	const cover_git = document.getElementById('cover-git');
	root_css.style.setProperty('--last_height_git', cover_git.offsetHeight.toString() + 'px');

	cover_git.classList.add('card-up-git');
	cover_git.classList.remove('card-down-git');

	git_label.classList.remove('fade-in');
	git_label.classList.add('fade-out');
};

proceed.onclick = () => {
	window.location.replace('#contribute');
	document.getElementById('text-sub').classList.remove('fade-in-upwards');

	setTimeout(() => {
		document.getElementById('text-sub').classList.add('fade-in-upwards');
	}, 100);
};

const buttons = document.getElementsByTagName('button');
var properties = buttons[0];
var botlist    = buttons[1];
var addbot     = buttons[2];
var about      = buttons[3];

properties.onclick = () => { window.location.replace('app.html'); }
botlist.onclick = () => { window.location.replace('bot-list.html'); }
about.onclick = () => { window.location.replace('about.html'); }