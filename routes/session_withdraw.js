wiki.get('/member/withdraw', async (req, res) => {
	if(!islogin(req)) {
		res.redirect('/member/login?redirect=' + encodeURIComponent('/member/withdraw'));
		return;
	}
	
	var content = `
		<form class=withdraw-form method=post>
			<div class=form-group>
				<p><strong>[경고]</strong> 탈퇴 시 당신이 기여한 내용의 저작자 식별이 어려울 수 있습니다.</p>
			</div>
			
			<div class=form-group>
				<p>다음 항목이 삭제됩니다.</p>
				<ul class=wiki-list>
					<li>사용자 설정(스킨, 이메일 주소, 지원 PIN, ...)</li>
					<li>비밀번호 해시(로그인이 불가능해집니다)</li>
					<li>다중 계정 검사용 로그인 내역(기록된 경우)</li>
					<li>가지고 있는 권한</li>
					<li>문서함에 등록한 문서 및 분류</li>
				</ul>
			</div>
			
			<div class=form-group>
				<p>사용자 문서를 지우면 다른 사용자가 당신의 사용자 이름으로 가입할 수 있게 됩니다.</p>
				<label><input type=checkbox name=clear-userdoc /> 내 사용자 문서와 그 역사를 지움</label>
			</div>
			
			<div class=form-group>
				<p>편집한 문서에서 당신의 역사를 지우면 기여한 부분에 대한 저작권을 포기하는 것입니다.</p>
				<label><input type=checkbox name=clear-history /> 내가 기여한 부분의 문서 역사를 지움 (사용자 문서도 해당됨)</label>
			</div>
			
			<div class=form-group>
				<label>사용자 이름 입력(<strong>${ip_check(req)}</strong>):</label><br />
				<input type=text class=form-control name=confirmation />
			</div>
			
			<div class=form-group>
				<label>비밀번호 확인:</label><br />
				<input type=password class=form-control name=password id=passwordInput />
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-danger">탈퇴</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, '탈퇴', content, {}, _, _, 'withdraw'));
});

wiki.post('/member/withdraw', async (req, res) => {
	if(!islogin(req)) {
		res.redirect('/member/login?redirect=' + encodeURIComponent('/member/withdraw'));
		return;
	}
	
	const username = ip_check(req);
	
	if(req.body['confirmation'] !== ip_check(req)) return res.send(await showError(req, 'invalid_request_body'));
	const pwhash  = sha3(req.body['password']);
	const pwmatch = (await curs.execute("select password from users where username = ? and password = ?", [username, pwhash])).length;
	if(!pwmatch) return res.send(await showError(req, 'password_not_matching'));
	
	const clearUserdoc = req.body['clear-userdoc'];
	const clearHistory = req.body['clear-history'];
	
	if(clearUserdoc) {
		curs.execute("delete from history where title = ?", ['사용자:' + username]);
		curs.execute("delete from documents where title = ?", ['사용자:' + username]);
		curs.execute("delete from users where username = ?", [username]);
	} else {
		curs.execute("update users set password = '' where username = ?", [username]);
	}
	
	if(clearHistory) {
		curs.execute("delete from history where username = ? and ismember = 'author'", [username]);
	}
	
	curs.execute("delete from perms where username = ?", [username]);
	curs.execute("delete from user_settings where username = ?", [username]);
	curs.execute("delete from useragents where username = ?", [username]);
	curs.execute("delete from login_history where username = ?", [username]);
	
	try { req.session.username = undefined; } catch(e) { };
	
	res.send(await render(req, '탈퇴 완료', '<strong>' + html.escape(username) + '</strong>님, 안녕히 가십시오.', {}, _, _, 'withdraw_complete'));
});
