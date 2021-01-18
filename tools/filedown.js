const http = require('http');
const https = require('https');
const readline = require('readline');
const cliProgress = require('cli-progress');
const fs = require('fs');

const pb = new cliProgress.Bar({
	barIncompleteChar: '_',
	barCompleteChar: '█',
	format: '받기 [{bar}] ({percentage}%) {total}중 {value}'
}, cliProgress.Presets.legacy);

function input(prpt) {
	const rl = readline.createInterface(process.stdin, process.stdout);
	return new Promise(resolve => {
		rl.question(prpt || '> ', answer => {
			rl.close(), resolve(answer);
		});
	});
}

input('파일 주소: ').then(url => 
input('파일 이름: ').then(fn => {

(url.startsWith('https:') ? https : http).get(url, res => {
	res.setEncoding('base64'); 
	const total = Number(res.headers['content-length']);
	
	pb.start(total || 1, 0);
	
	var ret = '';
	
	res.on('data', chunk => {
		ret += chunk;
		if(total) {
			pb.update(Buffer.from(ret, 'base64').length);
		}
	});
	
	res.on('end', function() {
		pb.update(total), fs.writeFileSync('./' + fn, ret, 'base64'), process.exit(0);
	});
}).end();

}));