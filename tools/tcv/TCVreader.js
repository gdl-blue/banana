// Text-based Console Video (텍스트 기반 콘솔 화상)

const fs = require('fs');

const filename = "snow.tcv";
const bytes    = fs.readFileSync(filename, 'utf8');

if(bytes.slice(0, 3) != "TCV") {
	console.error("Not TCV file");
	process.exit(1);
}

if(bytes[4].charCodeAt() != 101) {
	console.error("Not compatible file");
	process.exit(1);
}

if(bytes[5].charCodeAt() != 16) {
	console.error("Not compatible file");
	process.exit(1);
}

if(bytes[6].charCodeAt() != 100) {
	console.error("Not compatible file");
	process.exit(1);
}

const frameLines = bytes[7].charCodeAt();
const frameCount = bytes[8].charCodeAt();
const frameDelay = bytes[9].charCodeAt();

const topMargin = bytes[10].charCodeAt();
const rightMargin = bytes[11].charCodeAt();

const loopCount = bytes[12].charCodeAt();

const clearScreen = bytes[13].charCodeAt();

var frm  = 1;
var loop = 0;

console.clear();

var _timer = setInterval(function() {
	console.clear();
	
	for(var i=0; i<topMargin; i++) process.stdout.write('\n');
	
	for(var line=(frm-1)*frameLines+2; line<(frm-1)*frameLines+2+frameLines; line++) {
		try {
			if(bytes.split('\n')[line-1].endsWith('') || bytes.split('\n')[line-1] == '') continue;
		} catch(e) {
			break;
		}
		for(var i=0; i<rightMargin; i++) process.stdout.write(' ');
		process.stdout.write(bytes.split('\n')[line-1] + '\n');
	}
	
	frm++;
	
	if(frm > frameCount) {
		loop++;
		
		if(loopCount < 255 && loop >= loopCount) {
			clearInterval(_timer);
			return;
		} else {
			frm = 1;
		}
	}
}, frameDelay * 100);

if(clearScreen) console.clear();
