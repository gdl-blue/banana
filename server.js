function httpRequest(host, path, port, https) {
  return new Promise((resolve, reject) => {
      require(https ? 'https' : 'http').request({
          host: host,
          path: path,
          headers: {
              "Cookie": 'a=1;',
              "Host": host,
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "ko",
              "Accept-Encoding": "gzip, deflate",
              "Connection": "keep-alive",
              "DNT": "1",
              "User-Agent": "Mozilla/5.0 (Windows NT 5.1; rv:68.0) Gecko/20100101 Goanna/4.7 Firefox/68.0 Mypal/28.16.0",
          },
          port: port || (https ? 443 : 80)
      }, function(res) {
          var ret = '';

          res.on('data', function(chunk) {
              ret += chunk;
          });

          res.on('end', function() {
              resolve(ret);
          });
      }).end();
  });
}
  
var rq = setInterval(function() {
  httpRequest('tbwiki2004.glitch.me', '/RecentDiscuss', undefined, 1);
}, (60 + Math.floor(Math.random() * 10)) * 1000);

const _fs = require('fs');
var ds = setInterval(function() {
  _fs.readdir('.', (error, files) => files.filter(name => /^(.*)[.]json$/.test(name)).forEach(file => _fs.unlink(file, () => 1)));
}, 1000 * 60 * 60 * 24);

eval(require('fs').readFileSync('./index.js').toString());
