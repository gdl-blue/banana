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
			
			<div class=form-group>
				<label>유효 기간 (미구현):</label><br>
				<label><input type=radio name=permanant value=true checked /> 무기한</label><br />
				<label>
					<input type=radio name=permanant value=false /> 만료일 지정
					
					<div style="margin-left: 40px;">
						<!-- placeholder: 구버전 브라우저 배려 -->
						<input group=expiration value="${req.query['expirationdate'] ? html.escape(req.query['expirationdate']) : ''}" type=date name=expiration-date placeholder="YYYY-MM-DD" class=form-control style="display: inline-block; width: auto;" />
						<input group=expiration value="${req.query['expirationtime'] ? html.escape(req.query['expirationtime']) : ''}" type=time name=expiration-time placeholder="HH:MM" class=form-control style="display: inline-block; width: auto;" /><br />
					</div>
				</label>
				<label>
					<input type=radio name=permanant value=duration checked /> 기간 지정
					
					<div style="margin-left: 40px;">
						<!-- placeholder: 구버전 브라우저 배려 -->
						<select name=duration class=form-control style="display: inline-block; width: auto;">
							<option value=60>1분</option>
							<option value=180>3분</option>
							<option value=300>5분</option>
							<option value=600>10분</option>
							<option value=1800>30분</option>
							<option value=3600>1시간</option>
							<option value=7200>2시간</option>
							<option value=21600>6시간</option>
							<option value=86400>하루</option>
							<option value=172800>이틀</option>
							<option value=259200>사흘</option>
							<option value=259200>나흘</option>
							<option value=432000>닷새</option>
							<option value=604800>이레</option>
							<option value=864000>열흘</option>
							<option value=1296000>보름</option>
							<option value=2592000>그믐</option>
							<option value=5184000>2달</option>
							<option value=7776000>3달</option>
							<option value=15552000>6달</option>
							<option value=31104000>한 해</option>
						</select>
					</div>
				</label>
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

// 더시드 호환용
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