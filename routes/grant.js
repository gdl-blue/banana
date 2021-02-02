// wiki.get('/admin/grant', (req, res) => res.redirect('/admin/permissions' + (req.query.username ? ('?username=' + encodeURIComponent(req.query.username)) : '')));

wiki.get('/admin/grant', async function grantPanel(req, res) {
	const username = req.query['username'];
	
	if(!getperm(req, 'grant', ip_check(req))) {
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
	
	if(!req.query['nojs'] && compatMode(req)) {
		res.redirect('/Upload?nojs=1');
		return;
	}
	
	await curs.execute("select username from users where username = ?", [username]);
	if(!curs.fetchall().length) {
		res.send(await showError(req, 'user_not_found'));
		return;
	}
	
	var chkbxs = '', opts = '', trows = '', tarea = '';
	
	for(prm of perms) {
		if(permsc.includes(prm)) continue;
		if(!getperm(req, 'developer', ip_check(req), 1) && permso.includes(prm)) continue;
		
		chkbxs += `
			<label title="${html.escape(prm)}"><input type=checkbox ${getperm(req, prm, username, 1) ? 'checked' : ''} name=permission value="${prm}" /> ${permnames[prm] ? permnames[prm] : prm}</label><br />
		`;
		
		opts += `
			<option value="${prm}">${permnames[prm] ? permnames[prm] : prm}</option>
		`;
		
		if(getperm(req, prm, username, 1)) {
			trows += `
				<tr id="perm-${prm}">
					<td>${permnames[prm] ? permnames[prm] : prm}</td>
					<td>${prm}</td>
					<td>
						<input type=hidden id=permissionInput value="${prm}" />
						<button type=button class="btn btn-danger btn-sm delete-permission-btn">회수</button>
					</td>
				</tr>
			`;
			
			tarea += prm + ',';
		}
	}
	
	const _form = (
		req.query['nojs'] == '1' ? (
			`
				<div class=form-group>
					<div class=multicol>
						${chkbxs}
					</div>
				</div>
			`
		) : (
			`
				<p>하단의 적용 단추를 눌러야 권한이 실제로 부여됩니다.
		
				<div class=form-group>
					<label>추가할 권한:</label><br />
					<div class="btn-group input-group">
						<select id=permissionSelect class=form-control>
							${opts}
						</select>
						<button type=button class="btn btn-info" id=addPermissionBtn>부여</button>
					</div>
				</div>
				
				<table class=table id=perm-list>
					<colgroup>
						<col />
						<col />
						<col style="width: 80px;" />
					</colgroup>
					
					<thead>
						<tr>
							<th>권한 이름</th>
							<th>권한 ID</th>
							<th>작업</th>
						<tr>
					</thead>
					
					<tbody>
						${trows}
					</tbody>
				</table>
				
				<textarea id=perm-tlist name=permission style="display: none;">${tarea}</textarea>
			`
		)
	);
	
	content += `
		<form method=post id=grant-form>
			${_form}
		
			<div class=form-group>
				<label>메모:</label><br>
				<input type=text name=note class=form-control />
			</div>
			
			<div class=form-group>
				<label>유효 기간<sup><a title="이번에 새로 부여한 권한만 해당되며 이미 가지고 있던 권한에는 자동으로 적용되지 않습니다. 또한 유효기간을 변경하려면 권한을 회수한 후 다시 부여해야 합니다.">[!]</a></sup>:</label><br>
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
					<input type=radio name=permanant value=duration /> 기간 지정
					
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
				<button type=submit class="btn btn-info" style="width: 100px;">적용</button>
			</div>
		</form>
	`;
	
	if(!req.query.nojs) {
		content += `
			<noscript>
				<meta http-equiv=refresh content="0; url=?nojs=1&username=${encodeURIComponent(username)}" />
			</noscript>
		`;
	}
	
	res.send(await render(req, '사용자 권한 부여', content));
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
	
	const isPermanant      = req.body['permanant'];
	const expirationDate   = req.body['expiration-date'];
	const expirationTime   = req.body['expiration-time'];
	const expirationString = `${expirationDate} ${expirationTime}:00`;
	const eduration        = req.body['duration'];
	
	if(!getperm(req, 'grant', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!isPermanant || (isPermanant == 'false' && (!expirationDate || !expirationTime)) || (isPermanant == 'duration' && !eduration)) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if((isPermanant == 'false' && (!stringInFormat(/^\d{1,}[-]\d{2,2}[-]\d{2,2}$/, expirationDate) || !stringInFormat(/^\d{2,2}[:]\d{2,2}$/, expirationTime)))) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	if(isPermanant == 'false' && isNaN(Date.parse(expirationString))) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	if(isPermanant == 'duration' && isNaN(Number(eduration))) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	var expiration;
	if(isPermanant == 'duration') {
		const dt = new Date();
		dt.setSeconds(dt.getSeconds() + eduration);
		expiration = dt.getTime();
	} else {
		expiration = isPermanant == 'true' ? '0' : new Date(expirationString).getTime();
	}
	//                                                                    ↓↓  필요없지만 혹시 몰라서 해둠  ↓↓
	const prmval = req.body['permission'].toString().replace(/\s/, '').replace(/^\[/, '').replace(/\]$/, '').replace(/[,]$/, '').split(',');
	
	for(prmi of perms) {
		if(!prmi) continue;
		
		const prm = updateTheseedPerm(prmi);
		
		if(!getperm(req, 'developer', ip_check(req), 1) && permso.includes(prm)) continue;
		
		if(getperm(req, prm, username, 1) && !prmval.includes(prm)) {
			logstring += '-' + prm + ' ';
			if(fpermlist[subwiki(req)][username]) fpermlist[subwiki(req)][username].splice(find(fpermlist[subwiki(req)][username], item => item == prm), 1);
			curs.execute("delete from perms where perm = ? and username = ?", [prm, username]);
		}
		else if(!getperm(req, prm, username, 1) && prmval.includes(prm)) {
			logstring += '+' + prm + ' ';
			if(!fpermlist[subwiki(req)][username]) fpermlist[subwiki(req)][username] = [prm];
			else fpermlist[subwiki(req)][username].push(prm);
			curs.execute("insert into perms (perm, username, expiration) values (?, ?, ?)", [prm, username, String(expiration)]);
		}
	}
	
	if(!logstring.length) {
		return res.send(await showError(req, 'nothing_changed'));
	}
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake, note, blocker_type) \
				values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
					'author', 'grant', ip_check(req), username, '', getTime(), expiration, '0', '0', logstring + '(' + (req.body['note'] ? req.body['note'] : '') + ')', (islogin(req) ? 'author' : 'ip')
				]);
	
	res.redirect('/admin/grant?username=' + encodeURIComponent(username));
});