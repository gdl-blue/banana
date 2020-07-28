wiki.get('/admin/grant', async function grantPanel(req, res) {
	const username = req.query['username'];
	
	if(!getperm('grant', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	var content = `
		<form method=get>
			<div class=form-group>
				<label>사용자 이름: </label><br />
				<input type=text class=form-control name=username>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 100px;">이동</button>
			</div>
		</form>
	`;
	
	if(!username) {
		res.send(await render(req, '권한 부여', content));
		return;
	}
	
	await curs.execute("select username from users where username = ?", [username]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'user_not_found'));
		return;
	}
	
	var chkbxs = '';
	
	for(prm of perms) {
		chkbxs += `
			<label><input type=checkbox ${getperm(prm, username) ? 'checked' : ''} name="${prm}"> ${prm}</label><br />
		`;
	}
	
	content += `
		<form method=post>
			<div class=form-group>
				${chkbxs}
			</div>
		
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 100px;">확인</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, username + ' 권한 부여', content));
});

wiki.post('/admin/grant', async function grantPermissions(req, res) {
	const username = req.query['username'];
	
	if(!username) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	await curs.execute("select username from users where username = ?", [username]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'user_not_found'));
		return;
	}
	
	var logstring = '';
	
	for(prm of perms) {
		if(!getperm('developer', ip_check(req)) && ['developer'].includes(prm)) continue;
		if(getperm(prm, username) && !req.body[prm]) {
			logstring += '-' + prm + ' ';
			if(permlist[username]) permlist[username].splice(find(permlist[username], item => item == prm), 1);
			curs.execute("delete from perms where perm = ? and username = ?", [prm, username]);
		}
		else if(!getperm(prm, username) && req.body[prm] == 'on') {
			logstring += '+' + prm + ' ';
			if(!permlist[username]) permlist[username] = [prm];
			else permlist[username].push(prm);
			curs.execute("insert into perms (perm, username) values (?, ?)", [prm, username]);
		}
	}
	
	res.redirect('/admin/grant?username=' + encodeURIComponent(username));
});