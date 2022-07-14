// the ff. is used for crafting requests:
// when the server responds to the crafted request, the response
// will be passed on a callback with "type" and "response" parameter

// type: error/response - the type of response the server made
// response: the data from the server response
// note that the response is in JSON format

async function packedRequest_GET(host, callback=(type, response)) {
	await fetch(host)
		.then(response => {
			return response.json()
		})

		.then(response => {
			callback('response', response)
		})

		.catch(error => {
			callback('error', error)
		})
}

async function packedRequest_POST(host, data, callback=(type, response)) {
	await fetch(host, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	})

		.then(response => {
			return response.json()
		})

		.then(response => {
			callback('response', response)
		})

		.catch(error => {
			callback('error', error)
		})
}