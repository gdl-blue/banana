// 필수 코드 시작 //
const render = require('./../../index.js').render;
const conn = require('./../../index.js').conn;
const curs = require('./../../index.js').curs;
const ip_check = require('./../../index.js').ip_check;
const ip_pas = require('./../../index.js').ip_pas;
const html = require('./../../index.js').html;
const ban_check = require('./../../index.js').ban_check;
const config = require('./../../index.js').config;
const getperm = require('./../../index.js').getperm;
const showError = require('./../../index.js').showError;
const toDate = require('./../../index.js').toDate;
const generateTime = require('./../../index.js').generateTime;
const timeFormat = require('./../../index.js').timeFormat;
const islogin = require('./../../index.js').islogin;
const stringInFormat = require('./../../index.js').stringInFormat;
const timeout = require('./../../index.js').timeout;
const generateCaptcha = require('./../../index.js').generateCaptcha;
const validateCaptcha = require('./../../index.js').validateCaptcha;
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
