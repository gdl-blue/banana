const path = require('path');
const fs = require('fs');
const sha1 = require('sha1');
const Bar = require('cli-progress').Bar;

const pb = new Bar({
	barIncompleteChar: '_',
	barCompleteChar: '█',
	format: '처리중 [{bar}] ({percentage}%) {total}개 중 {value} 완료'
});

const files = (p => fs.readdirSync(p).filter(f => !(fs.statSync(path.join(p, f)).isDirectory())))('./');
pb.start(files.length, 0);

var i = 0;
for(file of files) {
	fs.appendFileSync('./btth.sha1', sha1(fs.readFileSync('./' + file)) + ' *' + file + '\r\n\r\n');
	pb.update(++i);
}
