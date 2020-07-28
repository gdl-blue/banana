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
	codes: {
		getacl: async function(req, title, action) {
			// ACL 제한여부 확인
			// 제한됨=false 반환, 아니면 true 반환
			
			
		},
		aclControlPanel: async function(req, res) {
			// ACL 설정 페이지(GET)
			
			const title = req.params[0];
			
			const permlist = [
				['any', '모두'],
				['member', '로그인된 사용자'],
				['blocked_ip', '차단된 아이피'],
				['blocked_member', '차단된 계정'],
				['admin', '관리자'],
				['developer', '소유자'],
				['document_creator', '문서를 만든 사용자'],
				['document_last_edited', '문서에 마지막으로 기여한 사용자'],
				['document_contributor', '문서 기여자'],
				['blocked_before', '차단된 적이 있는 사용자'],
				['discussed_document', '이 문서에서 토론한 사용자'],
				['discussed', '토론한 적이 있는 사용자'],
				['has_starred_document', '이 문서를 주시하는 사용자']
			];
			
			var permopts = '';
			
			for(var prm of permlist) {
				permopts += `<option value="${prm[0]}">${prm[1]}</option>`;
			}

			var content = `
				<form method=post>
					<div class=form-group>
						<label>읽기: </label><br>
						<select name=read class=form-control size=5>${permopts}</select>
					</div>
					
					<div class=form-group>
						<label>편집: </label><br>
						<select name=edit class=form-control size=5>${permopts}</select>
					</div>
					
					<div class=form-group>
						<label>토론: </label><br>
						<select name=discuss class=form-control size=5>${permopts}</select>
					</div>
					
					<div class=form-group>
						<label>편집 요청: </label><br>
						<select name=edit_request class=form-control size=5>${permopts}</select>
					</div>
				</form>
			`;
			
			res.send(await render(req, title, content, {}, ' (ACL)', undefined, 'acl'));
		},
		setacl: async function(req, res) {
			// ACL 저장 코드(POST)
			
			const title = req.params['title'];
			
			const aclname  = ['read', 'edit', 'discuss', 'edit_request'];
			
			const user = req.query['user'];
			
			const _0xaf63c7 = req.body['log'];
			const log = _0xaf63c7 ? _0xaf63c7 : '';
			
			var typnum = 0;
			
			for(acl of aclname) {
				const val = req.body[acl];
				
				if(!val) {
					res.send(await showError(req, 'invalid_request_body'));
					return;
				}
				
				curs.execute("insert into userbased_acl (title, user, action, type, typnum) values (?, ?, ?, ?, ?)", [
					title, user, val, acl, typnum++
				]);
			}
			
			timeout(1500);
			
			res.redirect('/acl/' + encodeURIComponent(title));
		}
	},
	// DB 추가 - 구문 => "테이블명": ['열1', '열2', ...]
	create_table: {
		'easy_acl': ['title', 'read', 'edit', 'discuss', 'edit_request']
	}
}
