function printKeys (){
	var leet = {
		'a' : '4',
		'e' : '3',
		'l' : '1',
		'o' : '0',
		's' : '5',
		't' : '7',
		'ck' : 'x',
		'3r' : '0r',
		'you' : 'j00'
	};

	Object.keys(leet).forEach(function (key){
		var regexp = new RegExp(key, 'gi');
		var html = html.replace(regexp, leet[keey]);
	});

	console.log(html);
}

