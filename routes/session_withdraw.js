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
				<p>사용자 문서는 삭제되지 않습니다. 동일한 이름으로 재가입은 불가능합니다.</p>
			</div>
			
			<div class=form-group>
				<p>다음 항목이 삭제됩니다.</p>
				<ul class=wiki-list>
					<li>사용자 설정(스킨, 이메일 주소, 지원 PIN, ...)</li>
					<li>비밀번호 해시(로그인 불가능)</li>
					<li>다중 계정 검사용 로그인 내역(기록된 경우)</li>
					<li>가지고 있는 권한</li>
				</ul>
			</div>
			
			<div class=form-group>
				<label>비밀번호 확인:</label><br>
				<input type=password class=form-control name=password id=passwordInput>
			</div>
			
			<div class=form-group>
				<label>위 내용을 확인했으면 '동의'라고 입력합니다:</label><br>
				<input type=text class=form-control name=confirm>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-danger">탈퇴</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, '탈퇴', content, {}, _, _, 'withdraw'));
});

