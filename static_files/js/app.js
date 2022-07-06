const buttons = document.getElementsByTagName('button')

properties = buttons[0]
botlist    = buttons[1]
addbot     = buttons[2]
about      = buttons[3]
contribute = buttons[4]

botlist.onclick = () => {
	window.location.replace('bot-list.html')
}

// just for footer design
