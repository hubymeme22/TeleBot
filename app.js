const express = require('express');
const app = express();

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
const TGFunctions = require('./bot-handler');

// for checking if the token is good
app.get('/check_token/:token', (req, res) => {
	const token = req.params.token;
	TGFunctions.checkBot(token, (data) => {
		res.send(data);
	});
});

// for adding the bot on the list of user
// returns: bot default properties
app.get('/add_token/:token', (req, res) => {
	const token = req.params.token;
	const response = TGFunctions.addToken(token);

	res.send(response);
});

// for running a specific bot
app.get('/run/:token', (req, res) => {
	const token = req.params.token;

	// run this token
	const response = TGFunctions.startBot(token);
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
app.post('/add_function/:token', (req, res) => {
	const token = req.params.token;
	const bot_func = req.body;

	const response = TGFunctions.addFunction(token, bot_func);
	res.send(response);
});

const ip = 'localhost';
const port = 80;
app.listen(port, ip, () => {
	console.log('[+] Server started!');
	console.log(`Access through : http://${ip}:${port}/`);
});