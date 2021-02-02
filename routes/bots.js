wiki.get('/member/bots', async(req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=/member/bots');
	
	var content = `
		<form method=put class=settings-section>
			<div class=form-group>
				<label>만들 봇 이름: </label><br />
				<input type=text name=username class=form-control />
				
				<label>메모: </label><br />
				<input type=text name=note class=form-control />
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 100px;">확인</button>
			</div>
		</form>
	`;
	
	var dbdata = await curs.execute("select username, token from bots where owner = ?", [ip_check(req)]);
	for(bot of dbdata) {
		with(bot) {
			var db2 = await curs.execute("select time from history where rev = '1' and title = ?", ['사용자:' + username]);
			
			content += `
				<form method=patch>
					<h2>${html.escape(username)}</h2>
					<input type=hidden name=username value="${html.escape(username)}" />
					
					<div class=form-group>
						<ul class=wiki-list>
							<li>생성일: ${ generateTime(toDate((db2[0] || { time: '0' }).time), 'Y-m-d H:i:s') }</li>
							<li>토큰: <a href="#" onclick="prompt('봇의 토큰은 다음과 같습니다.', '${token}');">[눌러서 확인]</a></li>
						</ul>
					</div>
					
					<div class=form-group>
						<label>봇 이름 변경: [미구현]</label><br />
						<input type=text readonly class=form-control value="${html.escape(username)}" />
					</div>
					
					<div class=form-group>
						<label><input type=checkbox name=reset-token value=Y /> 확인을 누르면 토큰 재설정</label>
					</div>
					
					<div class=btns>
						<button type=submit class="btn btn-primary">확인</button>
						<a href="/w/사용자:${encodeURIComponent(username)}" class="btn btn-secondary">사용자 문서</a>
					</div>
				</form>
			`;
		}
	}
	
	res.send(await render(req, '봇 관리자', content))
});

wiki.put('/member/bots', async(req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=/member/bots');
	const { username, note } = req.body;
	
	var dbdata = await curs.execute("select username from bots where username = ?", [username]);
	if(dbdata.length) return res.send(await showError(req, 'bot_already_exists'));
	
	var dbdata = await curs.execute("select title from history where title = ?", ['사용자:' + username]);
	if(dbdata.length) return res.send(await showError(req, 'username_already_exists'));
	
	const token = rndval('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 128);
	
	curs.execute("insert into bots (username, owner, token) values (?, ?, ?)", [username, ip_check(req), token]);
	
	curs.execute("insert into users (username, password, tribe) values (?, ?, ?)", [username, '', (itoa(randint(1, 9)))]);
	curs.execute("insert into documents (title, content) values (?, '')", ["사용자:" + username]);
	curs.execute("insert into history (title, content, rev, time, username, changes, log, iserq, erqnum, advance, ismember) \
					values (?, '', '1', ?, ?, '0', ?, '0', '', '(새 문서)', 'author')", [
						'사용자:' + username, getTime(), username, ((note || '') + ' [소유자: ' + ip_check(req) + ']')
					]);
	fpermlist[subwiki(req)][username] = ['bot'];
	curs.execute("insert into perms (perm, username, expiration) values (?, ?, ?)", ['bot', username, String(0)]);
	
	tokens[token] = { username, owner: ip_check(req) };
	
	return res.redirect('/member/bots');
});

wiki.patch('/member/bots', async(req, res) => {
	res.send('봇 수정');
	
});
