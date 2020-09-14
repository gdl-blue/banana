wiki.get('/admin/ban_users', async function blockControlPanel(req, res) {
	const from  = req.query['from'];
	const until = req.query['until'];
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	var content = `
		<form method=post class=settings-section>
			<div class=form-group>
				<label>사용자:</label><br />
				
				<table>
					<colgroup>
						<col style="width: 100px;" />
						<col />
					</colgroup>
				
					<tr>
						<td style="padding: 0;">
							<select name=usertype class=form-control>
								<option ${req.query['usertype'] == 'ip' ? 'selected' : ''} value=ip>IP</option>
								<option ${req.query['usertype'] == 'author' ? 'selected' : ''} value=author>계정</option>
							</select>
						</td>
						
						<td style="padding: 0 0 0 10px;">
							<input value="${req.query['username'] ? html.escape(req.query['username']) : ''}" type=text name=username id=usernameInput class=form-control />
						</td>
					</tr>
				</table>
			</div>
			
			<div class=form-group>
				<label>차단 사유:</label><br />
				<input type=text name=note id=noteInput class=form-control />
			</div>
			
			<div class=form-group>
				<label>차단 만료일:</label><br>
				
				<label><input type=radio name=permanant value=true /> 무기한</label><br />
				<label>
					<input type=radio name=permanant value=false /> 만료일 지정
					
					<div style="margin-left: 40px;">
						<!-- placeholder: 구버전 브라우저 배려 -->
						<input group=expiration value="${req.query['expirationdate'] ? html.escape(req.query['expirationdate']) : ''}" type=date name=expiration-date placeholder="YYYY-MM-DD" class=form-control style="display: inline-block; width: auto;" />
						<input group=expiration value="${req.query['expirationtime'] ? html.escape(req.query['expirationtime']) : ''}" type=time name=expiration-time placeholder="HH:MM" class=form-control style="display: inline-block; width: auto;" /><br />
						<label><input group=expiration type=checkbox name=fakepermanant /> 무기한으로 표시<sup><a title="실제로는 기한을 지정하지만 무기한으로 표시합니다. VPN IP 차단을 목적으로 하는 반달을 차단할 때 사용하면 좋습니다.">[?]</a></sup></label>
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
			
			<div class=form-group>
				<label><input ${req.query['blockview'] == '1' ? 'checked' : ''} type=checkbox name=blockview /> 접속 완전 차단<sup><a title="계정은 로그아웃, IP는 데이타 네트워크 등으로 쉽게 우회할 수 있습니다.">[!]</a></sup></label><br>
				<label><input ${req.query['al'] == '1' ? 'checked' : ''} type=checkbox name=al /> 로그인 시 차단하지 않음<sup><a title="IP 주소를 차단할 때에만 유효한 설정입니다. 로그인하면 편집할 수 있습니다.">[?]</a></sup></label><br>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 120px;">차단</button>
			</div>
		</form>
		
		<form method=post action="/admin/unban_user" style="display: inline-block; float: left; width: 49%;">
			<label>바로 해제:</label><br />
			<div class="input-group btn-group">
				<select type=text name=usertype class=form-control>
					<option value=ip>IP</option>
					<option value=author>계정</option>
				</select>
				<input type=text name=username class=form-control />
				<button type=submit class="btn btn-info">해제</button>
			</div>
		</form>
		
		<form method=get style="display: inline-block; float: right; width: 49%;">
			<label>검색:</label><br />
			<div class="input-group btn-group">
				<input type=text name=from class=form-control />
				<button type=submit class="btn btn-info">이동</button>
			</div>
		</form>
		
		<table class="table table-hover">
			<colgroup>
				<col style="width: 210px;">
				<col>
				<col style="width: 170px;">
				<col style="width: 60px;">
				<col style="width: 60px;">
				<col style="width: 80px;">
				<col style="width: 60px;">
			</colgroup>
			
			<thead>
				<tr>
					<td><strong>이름</strong></td>
					<td><strong>사유</strong></td>
					<td><strong>만료일</strong></td>
					<td><strong>유형</strong></td>
					<td><strong>접속</strong></td>
					<td><strong>로그인</strong></td>
					<td><strong>해제</strong></td>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	// 'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al']
	// 'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'blockview']
	
	// await curs.execute("delete from banned_users where cast(endingdate as integer) < ? and not endingdate = '0'", [new Date().getTime()]);
	
	if(from) {
		await curs.execute("select username, blocker, startingdate, endingdate, ismember, al, blockview, note from banned_users \
								where username >= ? order by username limit 100", [from]);

	} else if(until) {
		await curs.execute("select username, blocker, startingdate, endingdate, ismember, al, blockview, note from banned_users \
								where username <= ? order by username limit 100", [until]);

	} else {
		await curs.execute("select username, blocker, startingdate, endingdate, ismember, al, blockview, note from banned_users \
								order by username asc limit 100");
	}
	
	var set = 0, lu, fu;
	
	var trlist = '';
	
	for(var row of curs.fetchall()) {
		if(until) {
			if(!set) { set = 1; lu = row.username; }
			fu = row.username;
		} else {
			if(!set) { set = 1; fu = row.username; }
			lu = row.username;
		}
		
		var data = `
			<tr>
				<td>${html.escape(row['username'])}</td>
				<td>${html.escape(row['note'])}</td>
				<td>${row['endingdate'] != '0' ? generateTime(toDate(row['endingdate']), timeFormat) : '영구'}</td>
				<td>${row['ismember'] == 'ip' ? 'IP' : '계정'}</td>
				<td>${row['blockview'] == '1' ? '불가' : '가능'}</td>
				<td>${row['al'] == '1' ? '가능' : (row['ismember'] == 'ip' ? '불가' : '-')}</td>
				<td>
					<form method=post action="/admin/unban_user" onsubmit="return confirm('사용자를 차단해제하시겠습니까?');">
						<input type=hidden name=username value="${html.escape(row['username'])}">
						<input type=hidden name=usertype value="${html.escape(row['ismember'])}">
						
						<button type=submit class="btn btn-danger btn-sm">해제</button>
					</form>
				</td>
			</tr>
		`;
		
		if(until) trlist = data + trlist;
		else trlist += data;
	}
	
	if(!trlist.length) {
		trlist = `
			<tr>
				<td colspan=7 style="text-align: center;">(차단한 사용자가 없습니다.)</td>
			</tr>
		`;
	}
	
	content += `
				${trlist}
			</tbody>
		</table>
		
		${navbtn('/admin/ban_users', lu, fu)}
	`;
	
	res.send(await render(req, '차단', content, _, _, _, 'ban_users'));
});

wiki.post('/admin/ban_users', async function banUser(req, res) {
	var   username         = req.body['username'];
	const usertype         = req.body['usertype'];
	const blockview        = req.body['blockview'];
	const al               = req.body['al'] ? '1' : '0';
	const isPermanant      = req.body['permanant'];
	const expirationDate   = req.body['expiration-date'];
	const expirationTime   = req.body['expiration-time'];
	const fake             = req.body['fakepermanant'];
	const note             = req.body['note'];
	const expirationString = `${expirationDate} ${expirationTime}:00`;
	const eduration        = req.body['duration'];
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!note || !username || !usertype || !isPermanant || (isPermanant == 'false' && (!expirationDate || !expirationTime)) || (isPermanant == 'duration' && !eduration)) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if(!['author', 'ip'].includes(usertype) || (isPermanant == 'false' && (!stringInFormat(/^\d{1,}[-]\d{2,2}[-]\d{2,2}$/, expirationDate) || !stringInFormat(/^\d{2,2}[:]\d{2,2}$/, expirationTime)))) {
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
	
	if(usertype == 'ip' && !username.match(/\/(\d+)$/)) {
		if(username.match(/\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/))
			username += '/32';
		else
			username += '/128';
	}
	
	var expiration;
	if(isPermanant == 'duration') {
		const dt = new Date();
		dt.setSeconds(dt.getSeconds() + eduration);
		expiration = dt.getTime();
	} else {
		expiration = isPermanant == 'true' ? '0' : new Date(expirationString).getTime();
	}
	
	const startTime  = new Date().getTime();
	
	// 'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al']
	// 'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'blockview']
	
	curs.execute("insert into banned_users (username, blocker, startingdate, endingdate, ismember, al, blockview, fake, note) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						username, ip_check(req), startTime, expiration, usertype, al, blockview, fake == 'on' ? '1' : '0', note
					]);
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake, note) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						usertype, usertype == 'ip' ? 'ipacl_add' : 'suspend', ip_check(req), username, '', startTime, expiration, al, fake == 'on' ? '1' : '0', note
					]);
	
	res.redirect('/admin/ban_users');
});

wiki.post('/admin/unban_user', async function unban(req, res) {
	const username = req.body['username'];
	const usertype = req.body['usertype'];
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!username || !usertype) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if(!['ip', 'author'].includes(usertype)) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	curs.execute("delete from banned_users where username = ? and ismember = ?", [username, usertype]);
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake, note) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						usertype, usertype == 'ip' ? 'ipacl_remove' : 'unsuspend', ip_check(req), username, '', getTime(), '-1', '0', '0', '(차단 해제)'
					]);
					
	res.redirect('/admin/ban_users');
});