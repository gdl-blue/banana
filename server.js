const os = require('os');
const fs = require('fs');

if(os.platform() == 'win32') {
    ver = os.release().split('.');
    
    if( !( Number(ver[0]) >= 6 && Number(ver[1]) >= 1 ) && ver[0] != '10' ) {
        console.log('이런! 이 애플리케이션은 Windows 7 이상의 환경(Node.js 6 이상)에서 호스팅할 수 있습니다 ^^;; 이용에 불편을 드려 대단히 죄송합니다 -;');
        process.exit(0);
    }
}

if(Number(process.version.replace(/^v/, '').split('.')[0]) < 6) {
    console.log('Node.js 버전 6 이상에서 실행해주세요~ ;;');
    process.exit(0);
}

require('./banana.js').run();
