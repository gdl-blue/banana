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
	
	const key = (req.query['key'] || 'pass').toString();
	await curs.execute("select key from account_creation where key = ?", [key]);
	if(!curs.fetchall().length && config.getString('disable_email', '0') != '1') {
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
	
	const captcha = generateCaptcha(req, 1);
	
	res.send(await render(req, '계정 만들기', `
		<form class=signup-form method=post>
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

			<div class=form-group style="display: none;">
				<label><input name=use-tribe type=checkbox /> 내 계정에 종족 지정하기<sup><a title="계정을 종족에 가입시킵니다. 종족은 무작위로 결정되며 변경하거나 나가기가 불가능합니다. 이 기능을 원하지 않는다면 끄실 수 있습니다. 그냥 재미로 보세요.">[?]</a></sup></label>
			</div>
			
			<div class=form-group>
				${captcha}
			</div>
			
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
	if(!curs.fetchall().length && config.getString('disable_email', '0') != '1') {
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
	
	const captcha = generateCaptcha(req, 1);
	
	if(id.match(/(?:[^A-Za-z0-9_ㄱ-힣?!&lt;&gt;※#★☆♣♠♤☎☏♨ -])/)) {  // 터보위키와 동일한 문자허용 방식임
		res.send(await showError(req, 'invalid_value'));
		
		return;
	}
	
	await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
	if(curs.fetchall().length) {
		res.send(await showError(req, 'member_exists'));
		
		return;
	}
	
	if(!id.length) {
		res.send(await showError(req, 'no_value'));
		
		return;
	}
	
	if(!pw.length) {
		res.send(await showError(req, 'no_value'));
		
		return;
	}
	
	if(pw != pw2) {
		res.send(await showError(req, 'invalid_value'));
		
		return;
	}
	
	await curs.execute("select username from users");
	if(!curs.fetchall().length) {
		for(perm of perms) {
			if(permse.includes(perm)) continue;
			await curs.execute(`insert into perms (username, perm) values (?, ?)`, [id, perm]);
			if(typeof(fpermlist[''][id]) == 'undefined')
				fpermlist[''][id] = [perm];
			else
				fpermlist[''][id].push(perm);
		}
	}
	
	req.session.username = id;
	
	curs.execute("insert into users (username, password, tribe) values (?, ?, ?)", [id, sha3(pw), req.body['use-tribe'] ? (itoa(randint(1, 9))) : '0']);
	
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