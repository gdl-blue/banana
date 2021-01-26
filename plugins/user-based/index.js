// 필수 코드 시작 //
const {
	render, conn, curs, ip_check, ip_pas, html, ban_check, config, getperm, 
	showError, getTime, toDate, generateTime, timeFormat, islogin, stringInFormat, 
	timeout, generateCaptcha, validateCaptcha, alertBalloon
} = require('./../../index.js');
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
			const user = req.query['user'];
			
			var content = '';
			
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
			
			if(!user) {
				content = `
					<form method=get>
						<div class=form-group>
							<label>대상: </label><br>
							<select class=form-control name=user>
								${permopts}
							</select>
						</div>
						
						<div class=btns>
							<button type=submit class="btn btn-info" style="width: 100px;">이동</button>
						</div>
					</form>
					
					<ul class=wiki-list>
				`;
				
				await curs.execute("select user from userbased_acl where title = ?", [title]);
				
				for(acl of curs.fetchall()) {
					content += `<li><a href="?${encodeURIComponent(acl)}">${html.escape(acl)}</a></li>`;
				}
				
				content += '</ul>';
			} else {
				const dispname = ['읽기', '편집', '토론', '편집 요청', '되돌림', '이전 판 읽기', '삭제', '이동', '비교'];
				const aclname  = ['read', 'edit', 'discuss', 'edit_request', 'revert', 'view_old_revision', 'delete', 'move', 'diff'];
				
				content = `
					<form method=post>
						<div class=form-group>
							<table class=table>
								<colgroup>
									<col>
									<col style="width: 75px;">
									<col style="width: 75px;">
									<col style="width: 75px;">
								</colgroup>
								
								<thead>
									<tr>
										<td><strong>작업</strong></td>
										<td><strong>허용</strong></td>
										<td><strong>거부</strong></td>
										<td><strong>미정의</strong></td>
									</tr>
								</thead>
								
								<tbody id>`;
				
				for(var i=0; i<dispname.length; i++) {
					await curs.execute("select action from userbased_acl where title = ? and user = ? and type = ? order by cast(typnum as integer) asc", [title, user, aclname[i]]);
					var data = curs.fetchall();
				
					content += `
						<tr>
							<td>${dispname[i]}</td>
							
							<td>
								<input ${!getperm('acl', ip_check(req)) ? 'disabled' : ''} type=radio value=allow name=${aclname[i]} ${data[0] && data[0]['action'] == 'allow' ? 'checked' : ''}>
							</td>
							
							<td>
								<input ${!getperm('acl', ip_check(req)) ? 'disabled' : ''} type=radio value=deny name=${aclname[i]} ${data[0] && data[0]['action'] == 'deny' ? 'checked' : ''}>
							</td>
							
							<td>
								<input ${!getperm('acl', ip_check(req)) ? 'disabled' : ''} type=radio value=undefined name=${aclname[i]} ${!data[0] || (data[0] && data[0]['action'] == 'undefined') ? 'checked' : ''}>
							</td>
						</tr>
					`;
				}
				
				content += `
								</tbody>
							</table>
						</div>
						
						<div class=form-group>
							<label>요약: </label><br />
							<input type=text class=form-control name=log>
						</div>
						
						<div class=btns>
							<button type=submit class="btn btn-primary" style="width: 100px;">저장</button>
						</div>
					</form>
				`;
			}
			
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
		'userbased_acl': ['title', 'user', 'action', 'type', 'typnum']
	}
}
