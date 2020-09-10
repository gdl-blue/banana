wiki.get('/admin/grant', (req, res) => res.redirect('/admin/permissions' + (req.query.username ? ('?username=' + encodeURIComponent(req.query.username)) : '')));

wiki.get('/admin/permissions', async function grantPanel(req, res) {
	const username = req.query['username'];
	
	if(!getperm('grant', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	var content = `
		<form method=get>
			<div class=form-group>
				<label>사용자 이름: </label><br />
				<input type=text class=form-control name=username value="${html.escape(username ? username : '')}" />
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 100px;">이동</button>
			</div>
		</form>
	`;
	
	if(!username) {
		res.send(await render(req, '사용자 권한 부여', content));
		return;
	}
	
	await curs.execute("select username from users where username = ?", [username]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'user_not_found'));
		return;
	}
	
	var chkbxs = '';
	
	for(prm of perms) {
		if(permsc.includes(prm)) continue;
		if(!getperm('developer', ip_check(req), 1) && permso.includes(prm)) continue;
		
		chkbxs += `
			<label title="${html.escape(prm)}"><input type=checkbox ${getperm(prm, username, 1) ? 'checked' : ''} name="${prm}" /> ${permnames[prm] ? permnames[prm] : prm}</label><br />
		`;
	}
	
	content += `
		<form method=post>
			<div class=form-group>
				<div class=multicol>
					${chkbxs}
				</div>
			</div>
			
			<div class=form-group>
				<label>메모:</label><br>
				<input type=text name=note class=form-control>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 100px;">확인</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, '사용자 권한 부여', content));
});

wiki.post('/admin/permissions', async function grantPermissions(req, res) {
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
	
	for(prmi of perms) {
		const prm = updateTheseedPerm(prmi);
		
		if(!getperm('developer', ip_check(req), 1) && permso.includes(prm)) continue;
		if(getperm(prm, username, 1) && !req.body[prm]) {
			logstring += '-' + prm + ' ';
			if(permlist[username]) permlist[username].splice(find(permlist[username], item => item == prm), 1);
			curs.execute("delete from perms where perm = ? and username = ?", [prm, username]);
		}
		else if(!getperm(prm, username, 1) && req.body[prm] == 'on') {
			logstring += '+' + prm + ' ';
			if(!permlist[username]) permlist[username] = [prm];
			else permlist[username].push(prm);
			curs.execute("insert into perms (perm, username) values (?, ?)", [prm, username]);
		}
	}
	
	if(!logstring.length) {
		return res.send(await showError(req, 'nothing_changed'));
	}
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake, note) \
				values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
					'author', 'grant', ip_check(req), username, '', getTime(), '-1', '0', '0', logstring + '(' + (req.body['note'] ? req.body['note'] : '') + ')'
				]);
	
	res.redirect('/admin/grant?username=' + encodeURIComponent(username));
});

// 호환용
wiki.post('/admin/grant', async function (req, res) {
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
	
	const prmval = req.body['permission'];
	
	var logstring = '';
	
	for(prmi of perms) {
		const prm = updateTheseedPerm(prmi);
		
		if(!getperm('developer', ip_check(req), 1) && permso.includes(prm)) continue;
		
		if(getperm(prm, username, 1) && (typeof(prmval.find(prm)) == 'undefined')) {
			logstring += '-' + prm + ' ';
			if(permlist[username]) permlist[username].splice(find(permlist[username], item => item == prm), 1);
			curs.execute("delete from perms where perm = ? and username = ?", [prm, username]);
		}
		else if(!getperm(prm, username, 1) && (typeof(prmval.find(prm)) != 'undefined')) {
			logstring += '+' + prm + ' ';
			if(!permlist[username]) permlist[username] = [prm];
			else permlist[username].push(prm);
			curs.execute("insert into perms (perm, username) values (?, ?)", [prm, username]);
		}
	}
	
	if(!logstring.length) {
		return res.send(await showError(req, 'nothing_changed'));
	}
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake, note) \
				values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
					'author', 'grant', ip_check(req), username, '', getTime(), '-1', '0', '0', logstring + '(' + (req.body['note'] ? req.body['note'] : '') + ')'
				]);
	
	res.redirect('/admin/grant?username=' + encodeURIComponent(username));
});