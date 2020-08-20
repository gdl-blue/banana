wiki.get('/member/signup/:key', async function signupScreen(req, res) {
	res.redirect('/member/signup_key?key=' + req.params['key']);
});

wiki.get('/member/signup_key', async function signupScreen(req, res) {
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	await curs.execute("select username from users");
	const maxusercount = atoi(config.getString('max_users', '-1'));
	
	if(maxusercount != -1 && curs.fetchall().length >= maxusercount) {
		res.send(await showError(req, 'user_count_reached_maximum'));
		return;
	}
	
	const key = req.query['key'].toString();
	await curs.execute("select key from account_creation where key = ?", [key]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'invalid_signup_key'));
		
		return;
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	var warningText = '';
	var warningScript = '';
	
	if(!req.secure) {
		warningText = '<p><strong><font color=red>[경고!] HTTPS 연결이 아닌 것같습니다. 가입 시 개인정보가 유출될 수 있으며, 이에 대한 책임은 본인에게 있습니다.</font></strong></p>';
		warningScript = ` onsubmit="return confirm('지금 HTTPS 연결이 감지되지 않았습니다. 가입할 경우 비밀번호가 다른 사람에게 노출될 수 있으며, 이에 대한 책임은 본인에게 있습니다. 계속하시겠습니까?');"`;
	}
	
	const captcha = generateCaptcha(req, 2);
	
	res.send(await render(req, '계정 만들기', `
		${warningText}
	
		<form class=signup-form method=post${warningScript}>
			<div class=form-group>
				<label>사용자 이름:</label><br>
				<input class=form-control name="username" type="text">
			</div>

			<div class=form-group>
				<label>비밀번호:</label><br>
				<input class=form-control name="password" type="password">
			</div>

			<div class=form-group>
				<label>비밀번호 확인:</label><br>
				<input class=form-control name="password_check" type="password">
			</div>
			
			<div class=form-group>
				${captcha}
			</div>
			
			<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
			
			<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
		</form>
	`, {}));
});

wiki.post('/member/signup_key', async function createAccount(req, res) {
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	await curs.execute("select username from users");
	const maxusercount = atoi(config.getString('max_users', '-1'));
	
	if(maxusercount != -1 && curs.fetchall().length >= maxusercount) {
		res.send(await showError(req, 'user_count_reached_maximum'));
		return;
	}
	
	const key = req.query['key'];
	await curs.execute("select key from account_creation where key = ?", [key]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'invalid_signup_key'));
		
		return;
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	const id = req.body['username'];
	const pw = req.body['password'];
	const pw2 = req.body['password_check'];
	
	if(!validateCaptcha(req)){ res.send(await showError(req, 'invalid_captcha_number'));return; }
	
	const captcha = generateCaptcha(req, 2);
	
	if(id.match(/(?:[^A-Za-z0-9_ㄱ-힣?!&lt;&gt;※#★☆♣♠♤☎☏♨ -])/)) {  // 터보위키와 동일한 문자허용 방식임
		res.send(await render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 이름: </label><br>
					<input class=form-control name="username" type="text">
					<p class=error-desc>사용자 이름은 한글, 영어 대/소문자, 숫자, 밑줄, 느낌표, 우물정자, 삼각괄호, 당구장, 별, 빵꾸난별, 클로버, 스페이드, 빵꾸난 스페이드, 전화기, 흰전화기, 목욕탕, 공백, 대시만 들어갈 수 있습니다.</p>
				</div>

				<div class=form-group>
					<label>암호: </label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인: </label><br>
					<input class=form-control name="password_check" type="password">
				</div>
			
				<div class=form-group>
					${captcha}
				</div>
			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
	if(curs.fetchall().length) {
		res.send(await render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 이름: </label><br>
					<input class=form-control name="username" type="text">
					<p class=error-desc>해당 사용자가 이미 존재합니다.</p>
				</div>

				<div class=form-group>
					<label>암호: </label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인: </label><br>
					<input class=form-control name="password_check" type="password">
				</div>
			
				<div class=form-group>
					${captcha}
				</div>
			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(!id.length) {
		res.send(await render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 이름: </label><br>
					<input class=form-control name="username" type="text">
					<p class=error-desc>사용자 이름의 값은 필수입니다.</p>
				</div>

				<div class=form-group>
					<label>암호: </label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인: </label><br>
					<input class=form-control name="password_check" type="password">
				</div>
			
				<div class=form-group>
					${captcha}
				</div>

			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(!pw.length) {
		res.send(await render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 이름: </label><br>
					<input class=form-control name="username" type="text">
				</div>

				<div class=form-group>
					<label>암호: </label><br>
					<input class=form-control name="password" type="password">
					<p class=error-desc>암호의 값은 필수입니다.</p>
				</div>

				<div class=form-group>
					<label>암호 확인: </label><br>
					<input class=form-control name="password_check" type="password">
				</div>
			
				<div class=form-group>
					${captcha}
				</div>

			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(pw != pw2) {
		res.send(await render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 이름: </label><br>
					<input class=form-control name="username" type="text">
				</div>

				<div class=form-group>
					<label>암호: </label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인: </label><br>
					<input class=form-control name="password_check" type="password">
					<p class=error-desc>암호 확인이 올바르지 않습니다.</p>
				</div>
			
				<div class=form-group>
					${captcha}
				</div>

			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	await curs.execute("select username from users");
	if(!curs.fetchall().length) {
		for(perm of perms) {
			await curs.execute(`insert into perms (username, perm) values (?, ?)`, [id, perm]);
			if(typeof(permlist[id]) == 'undefined')
				permlist[id] = [perm];
			else
				permlist[id].push(perm);
		}
	}
	
	req.session.username = id;
	
	curs.execute("insert into users (username, password) values (?, ?)", [id, sha3(pw)]);
	
	curs.execute("insert into documents (title, content) values (?, '')", ["사용자:" + id]);
	
	curs.execute("insert into history (title, content, rev, time, username, changes, log, iserq, erqnum, advance, ismember) \
					values (?, '', '1', ?, ?, '0', '', '0', '', '(새 문서)', 'author')", [
						'사용자:' + id, getTime(), id
					]);
	
	if(config.getString('no_login_history', '0') == '0') {
		curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
		curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent'] ? req.headers['user-agent'] : '']);
	}
	
	res.redirect(desturl);
});