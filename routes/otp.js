wiki.get('/member/activate_otp', async(req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=%2Fmember%2Factivate_otp');
	if((await curs.execute("select key from otpkeys where username = ?", [ip_check(req)])).length) return res.send(await showError(req, 'already_activated'));
  
	const key = rndval('01234567', 4) + '-' + rndval('01234567', 4) + '-' + rndval('01234567', 4) + '-' + rndval('01234567', 4) + '-' + rndval('01234567', 4) + '-' + rndval('01234567', 4) + '-' + rndval('01234567', 4) + '-' + rndval('01234567', 4);
	req.session['otpkey'] = key.replace(/[-]/g, '');
  
	QRCode.toDataURL('otpauth://totp/' + encodeURIComponent(ip_check(req)) + '?secret=' + encodeURIComponent(key.replace(/[-]/g, '')) + '&issuer=' + encodeURIComponent(config.getString('site_name', '바나나')) + '&algorithm=SHA1&period=30', async(err, img) => {
		const content = `
			<form method=post>
				<ul class=wiki-list>
					<li>전화기에 Google OTP 혹은 Authy를 설치하고 하단의 [+] 기호를 누를 뒤, [제공된 키 입력]에 들어가 키를 입력합니다.</li>
					<li>전화기를 잃어버리거나 실수로 OTP 소프트웨어를 지웠을 때를 위해 안전한 곳에 키를 적어놓는 것이 좋습니다.</li>
				</ul>

				<div class=form-group>
					<label>OTP 키: </label><br />
					<input type=text readonly class=form-control value="${key}" />
				</div>

				<div class=form-group>
					<label>스캔 가능한 2차원 막대 코드(정상 작동 안 함): </label><br />
					<img src='${img}' />
				</div>

				<div class=form-group>
					<label>등록한 뒤 나오는 6자리 숫자: </label><br />
					<input type=number class=form-control name=token />
				</div>

				<div class=btns>
					<button type=submit class="btn btn-danger">지금 활성화</button>
				</div>
			</form>
		`;

		res.send(await render(req, '일회용 비밀번호 인증 활성화', content));
	});
});

wiki.post('/member/activate_otp', async(req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=%2Fmember%2Factivate_otp');
	if(!req.session['otpkey']) return res.send(await showError(req, 'invalid'));
	if(!req.body['token']) return res.send(await showError(req, 'invalid_request_body'));
	if((await curs.execute("select key from otpkeys where username = ?", [ip_check(req)])).length) return res.send(await showError(req, 'already_activated'));
	
	if(speakeasy.totp.verify({
		secret: req.session['otpkey'],
		encoding: 'base32',
		token: (req.body['token'] || 111111).toString()
	})) {
		curs.execute("insert into otpkeys (username, key) values (?, ?)", [ip_check(req), req.session['otpkey']]);
		return res.redirect('/member/mypage');
	} else {
		res.send(await showError(req, 'invalid_token'));
	}
});
