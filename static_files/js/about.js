const buttons = document.getElementsByTagName('button')

properties = buttons[0]
botlist    = buttons[1]
addbot     = buttons[2]
contribute = buttons[4]

properties.onclick = () => { window.location.replace('app.html'); }
botlist.onclick = () => { window.location.replace('bot-list.html'); }

wt.onclick = () => {
	document.querySelector('body').classList.add('backward-bg-change');
	document.getElementById('about-container').hidden = true;
	about.innerHTML = '<h1>Why TeleBot?</h1><br/><div class="content-limiter">TeleBot is a simple telegram bot maker/manager where you can create your own telegram bot without prior coding experience. We all know that in order to make a telegram bot, you either have to manually read the telegram api documentation, or use a library. Here in TeleBot, bot token is all you need. No coding, no long-sometimes-messy-documentation-reading and so on.</div><br/><img src="https://c.tenor.com/iTYu258_py8AAAAC/why-whatever.gif"><br/><br/>';
	goback.hidden = false;
};

wm.onclick = () => {
	document.querySelector('body').classList.add('backward-bg-change');
	document.getElementById('about-container').hidden = true;
	about.innerHTML = '<h1>Why make this project?</h1><br/><div class="content-limiter">As a programmer and computer science student, we\'d love to optimize or automate stuffs--make things more easier to use or implement so... What\'s better than making a bot in 3 easy steps? Yeah that\'s right, making a bot in 2 easy steps! Slap that thicc token and choose what functions your bot/s will perform, easy as that! I made this bot maker for you! users! so you can make one EASIER.<br/><br/>nah, I just neeeed money</div><br/><img src="https://c.tenor.com/kTLNTPAv9wcAAAAM/kermit-jenna.gif"><br/><br/>';
	goback.hidden = false;
};

ww.onclick = () => {
	document.querySelector('body').classList.add('backward-bg-change');
	document.getElementById('about-container').hidden = true;
	about.innerHTML = '<h1>What\'s with this messed up UI?</h1><br/><div class="content-limiter">Yeah, I am well aware that the UI is too "basic", "simple", "plain", or probably "messed up" I designed this myself and I agree x) the thing is, I really focused on the back-end side of this project rather than the front end so, If you are a front-end developer of course you can do better than this, you can always code one yourself paste it on static_files folder yadayada.</div><br/><img src="https://c.tenor.com/ds6CWzoBbgMAAAAM/thats-really-messed-up-superbad.gif"><br/><br/>';
	goback.hidden = false;
};

goback.onclick = () => {
	document.querySelector('body').classList.remove('backward-bg-change');
	document.getElementById('about-container').hidden = false;
	goback.hidden = true;
	about.innerHTML = '';

	document.querySelector('body').classList.remove('backward-bg-change');
	document.querySelector('body').classList.add('forward-bg-change');
}