md5 = require('md5');

hash = 'b9411af07f154a6fef543e7e442e4da9';
maxlen = 100;
fs = require('fs');

console.log('MD5 해시 ' + hash + '를 검색하는 중입니다. . . \n');

/*
chars = [];
for(i=65; i<91; i++) {
	chars.push(String.fromCharCode(i));
}

for(i=97; i<123; i++) {
	chars.push(String.fromCharCode(i));
}

for(i=48; i<58; i++) {
	chars.push(String.fromCharCode(i));
}
*/

chars = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
	'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
	'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a',
	'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
	't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1',
	'2', '3', '4', '5', '6', '7', '8', '9', ' ',
	'_', '.', ','
];


function go(a, s, b) {
	if(a == b) {
		s = s.join('');
		console.log(s + '\t');
		if(md5(s) == hash) {
			console.log('찾았습니다! - ' + s);
			fs.writeFileSync('md5reverse_' + hash + '.txt', s);
			process.exit(0);
		}
		return;
	}
	
	for(c of chars) {
		s[a] = c;
		go(a + 1, s, b);
	}
}

for(i=1; i<=maxlen; i++) {
	go(0, [], i);
}
