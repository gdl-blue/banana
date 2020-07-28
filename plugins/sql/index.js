// 필수 코드 시작 //
const render = require('./../../server.js').render;
const conn = require('./../../server.js').conn;
const curs = require('./../../server.js').curs;
const ip_check = require('./../../server.js').ip_check;
const ip_pas = require('./../../server.js').ip_pas;
const html = require('./../../server.js').html;
const ban_check = require('./../../server.js').ban_check;
const config = require('./../../server.js').config;
const getperm = require('./../../server.js').getperm;
const showError = require('./../../server.js').showError;
const toDate = require('./../../server.js').toDate;
const generateTime = require('./../../server.js').generateTime;
const timeFormat = require('./../../server.js').timeFormat;
const islogin = require('./../../server.js').islogin;
const stringInFormat = require('./../../server.js').stringInFormat;
const timeout = require('./../../server.js').timeout;
const generateCaptcha = require('./../../server.js').generateCaptcha;
const validateCaptcha = require('./../../server.js').validateCaptcha;
// 필수 코드 종료 //

module.exports = {
	urls: ['/ExecuteSQL'],
	codes: [
		{
			method: 'get',
			code: async function(req, res) {
				const captcha = generateCaptcha(req, 5);
				
				const sp = itoa(randint(1000, 9999));
				
				print(`SQL 실행 PIN: ${sp}`);
				
				req.session.sqlpin = sha3(sp);
				
				res.send(await render(req, 'SQL 실행', `
					<form method=post>
						<div class=form-group>
							<label>구문: </label><br>
							<input type=text name=sql class=form-control>
						</div>
						
						<div class=form-group>
							<label>터미널의 PIN: </label><br>
							<input type=password name=pin class=form-control>
						</div>
						
						<div class=form-group>
							${captcha}
						</div>
					
						<div class=btns>
							<button type=submit class="btn btn-primary" style="width: 100px;">실행</button>
						</div>
					</form>
				`));
			}
		}
	],
	permissions: [],
	create_table: {}
}
