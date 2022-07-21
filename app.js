const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('static_files'));
app.use((req, res, next) => {
	console.log(`${req.socket.remoteAddress}:${req.socket.remotePort} ==> ${req.url}`);
	next();
});

app.get('/', (req, res) => {
	res.redirect('/app.html');
});


///////////////////////////
// Bot Handling Requests //
///////////////////////////
const TGFunctions = require('./TGFunctions');

// for checking if the token is good
app.get('/check_token/:token', (req, res) => {
	const token = req.params.token;
	TGFunctions.checkBot(token, (data) => {
		res.send(data);
	});
});

// for running a specific bot
app.get('/run/:nickname', (req, res) => {
	const nickname = req.params.nickname;
	const token = TGFunctions.findToken(nickname);

	// run this token
	const response = TGFunctions.startBot(token);
	res.send(response);
});

// for stopping bot
app.get('/stop/:nickname', (req, res) => {
	const nickname = req.params.nickname;
	const token = TGFunctions.findToken(nickname);

	const isStopped = TGFunctions.stopBot(token);
	if (isStopped)
		res.send({code : 'ok'});
	else
		res.send({code : 'failed'});
});

// for getting all the user's current bot
app.get('/bot_list', (req, res) => {
	const list = require('./BotMap/bot_map.json');
	res.send(list);
});

// for getting all the available (and planned) functionalities
app.get('/function_list', (req, res) => {
	const callback_types = require('./BotMap/callback_types.json');
	res.send(callback_types);
});

// for removing a specific function from the bot
app.get('/remove_function/:nickname/:function_name', (req, res) => {
	const nickname = req.params.nickname;
	const token = TGFunctions.findToken(nickname);
	const fname = req.params.function_name;

	const response = TGFunctions.removeFunction(token, fname);
	res.send(response);
});

// for adding the bot on the list of user
// returns: bot default properties
app.post('/add_token/:token', (req, res) => {
	const token = req.params.token;
	const checks = req.body;
	const response = TGFunctions.addToken(token, checks);

	res.send(response);
});

// for setting the bot's whole functionality
app.post('/set_function/:token', (req, res) => {
	const token = req.params.token;
	const json_data = req.body;

	const response = TGFunctions.setFunction(token, json_data);
	res.send(response);
});

// for adding bot function
app.post('/add_function/:nickname', (req, res) => {
	const nickname = req.params.nickname;
	const token = TGFunctions.findToken(nickname);
	const bot_func = req.body.function_name;

	const response = TGFunctions.addFunction(token, bot_func);
	res.send(response);
});

const ip = 'localhost';
const port = 80;
app.listen(port, ip, () => {
	console.log('[+] Server started!');
	console.log(`Access through : http://${ip}:${port}/`);
});