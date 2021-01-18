wiki.get('/member/login', async function loginScreen(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	const captcha = generateCaptcha(req, 1);
	
	res.send(await render(req, '로그인', `
		<form class=login-form method=post>
			<div class=form-group>
				<label>사용자 이름:</label><br>
				<input class=form-control name="username" type="text">
			</div>
			<div class=form-group>
				<label>비밀번호:</label><br>
				<input class=form-control name="password" type="password">
			</div>
			
			<div class=form-group>
				${captcha}
			</div>
			
			<div class="checkbox" style="display: inline-block;">
				<label>
					<input type="checkbox" name="autologin">
					<span>자동 로그인</span>
				</label>
			</div>
			
			<a href="/member/recover_password" style="float: right;">[비밀번호 찾기]</a> <br>
			
			<a href="/member/signup" class="btn btn-secondary">가입</a><button type="submit" class="btn btn-primary">로그인</button>
		</form>
	`, {}));
});

wiki.post('/member/login', async function authUser(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	var   id = req.body['username'];
	const pw = req.body['password'];
	
	if(!validateCaptcha(req)){ res.send(await showError(req, 'invalid_captcha_number'));return; }
	
	const captcha = generateCaptcha(req, 1);
	
	if(!id.length) {
		res.send(await showError(req, 'username_not_specified'));
		return;
	}
	
	if(!pw.length) {
		res.send(await showError(req, 'password_not_specified'));
		return;
	}
	
	await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'username_not_found'));
		return;
	}
	
	id = curs.fetchall()[0]['username'];
	
	await curs.execute("select username, password from users where username = ? and password = ''", [id]);
	if(curs.fetchall().length) {
		res.send(await showError(req, 'invalid'));
		return;
	}
	
	await curs.execute("select username, password from users where username = ? and password = ?", [id, sha3(pw)]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'invalid_password'));
		
		return;
	}
	
	if(config.getString('no_login_history', '0') == '0')
		curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
	
	req.session.username = id;
	
	if(req.body['autologin']) {
		const usrtkn = rndval('0123456789abcdefghijklmnopqrstuvwxzABCDEFGHIJKLMNOPQRSTUVWXYZ', 64);
		await curs.execute("delete from tokens where username = ?", [id]);
		curs.execute("insert into tokens (username, token) values (?, ?)", [id, usrtkn]);
		
		res.cookie('gildong', id, {
			maxAge: 90 * 24 * 60 * 60 * 1000, 
			httpOnly: true
			//secure: true
		});
		res.cookie('icestar', sha3(sha3(sha3(sha3(pw))) + sha3(usrtkn)), {
			maxAge: 90 * 24 * 60 * 60 * 1000, 
			httpOnly: true
			//secure: true
		});
	}
	
	await curs.execute("delete from useragents where username = ?", [id]);
	if(config.getString('no_login_history', '0') == '0')
		curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent'] ? req.headers['user-agent'] : '']);
	
	res.redirect(desturl);
});

/*
router.all('/member/login', async (req, res) => {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	var warningText = '';
	
	if(!req.secure) {
		warningText = '<p><strong><font color=red>[경고!] HTTPS 연결이 아닌 것같습니다. 로그인할 시 개인정보가 유출될 수 있으며, 이에 대한 책임은 본인에게 있습니다.</font></strong></p>';
	}
	
	if(UCase(req.method) == 'POST') {
		if(!validateCaptcha(req)){ res.send(await showError(req, ('invalid_captcha_number')));return; }
	}
	
	const captcha = generateCaptcha(req, 2);
	
	var content = `
		<form class=login-form method=post>
			<div class=form-group>
				<label>사용자 이름:</label><br>
				<input class=form-control name="username" type="text">
			</div>

			<div class=form-group>
				<label>비밀번호:</label><br>
				<input class=form-control name="password" type="password">
			</div>
			
			<div class=form-group>
				${captcha}
			</div>
			
			<div class="checkbox" style="display: inline-block;">
				<label>
					<input type=checkbox name=autologin>
					<span>자동 로그인</span>
				</label>
				
				<label>
					<input type=checkbox name=encrypt-first id=encryptFirst checked>
					<span>[미구현] <strong>정보를 전송하기 전에 암호화</strong> - 이렇게 하면 HTTP 연결에서도 보안을 강화시킬 수 있으나 자바스크립트가 활성화되어있어야 합니다.</span>
				</label>
			</div>
			
			<a href="/member/recover_password" style="float: right;">[비밀번호 찾기]</a> <br>
			
			<a href="/member/signup" class="btn btn-secondary">가입</a><button type="submit" class="btn btn-primary">로그인</button>
		</form>
	`;
	
	if(UCase(req.method) == 'POST') {
		var   id = req.body['username'];
		const pw = req.body['password'];
		
		const captcha = generateCaptcha(req, 2);
		
		if(!id.length) {
			res.send(await render(req, '로그인', errorBalloon('username_not_specified') + content, _, _, 1));
			return;
		}
		
		if(!pw.length) {
			res.send(await render(req, '로그인', errorBalloon('password_not_specified') + content, _, _, 1));
			return;
		}
		
		await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
		if(!curs.fetchall().length) {
			res.send(await render(req, '로그인', errorBalloon('username_not_found') + content, _, _, 1));
			return;
		}
		
		id = curs.fetchall()[0]['username'];
		
		await curs.execute("select username, password from users where username = ? and password = ''", [id]);
		if(curs.fetchall().length) {
			res.send(await render(req, '로그인', errorBalloon('invalid') + content, _, _, 1));
			return;
		}
		
		await curs.execute("select username, password from users where username = ? and password = ?", [id, sha3(pw)]);
		if(!curs.fetchall().length) {
			res.send(await render(req, '로그인', errorBalloon('invalid_password') + content, _, _, 1));
			
			return;
		}
		
		if(config.getString('no_login_history', '0') == '0')
			curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
		
		req.session.username = id;
		
		if(req.body['autologin']) {
			const usrtkn = rndval('0123456789abcdefghijklmnopqrstuvwxzABCDEFGHIJKLMNOPQRSTUVWXYZ', 64);
			await curs.execute("delete from tokens where username = ?", [id]);
			await curs.execute("insert into tokens (username, token) values (?, ?)", [id, usrtkn]);
			
			res.cookie('gildong', id, {
				maxAge: 90 * 24 * 60 * 60 * 1000, 
				httpOnly: true
				//secure: true
			});
			res.cookie('icestar', sha3(sha3(sha3(sha3(pw))) + sha3(usrtkn)), {
				maxAge: 90 * 24 * 60 * 60 * 1000, 
				httpOnly: true
				//secure: true
			});
		}
		
		await curs.execute("delete from useragents where username = ?", [id]);
		if(config.getString('no_login_history', '0') == '0')
			curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent'] ? req.headers['user-agent'] : '']);
		
		res.redirect(desturl);
	} else
	
	res.send(await render(req, '로그인', content, {}));
});
*/